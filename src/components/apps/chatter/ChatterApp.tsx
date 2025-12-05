import { useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, User } from 'lucide-react';
import { RootState } from '../../../store';
import {
  setActiveContact,
  addMessage,
  setTyping,
  setPendingChoices,
  selectChoice,
  advanceDialogue,
  startDialogue,
  unlockContact,
  setContactUnread,
} from '../../../features/dialogueSlice';
import {
  unlockApp,
  unlockProcess,
  setGameOver,
  addNotification,
} from '../../../features/gameSlice';
import { identifyStakeholder, updateStakeholderAttitude, decomposeStakeholder } from '../../../features/pmisSlice';
import { updateConstraint } from '../../../features/gameSlice';
import { addItem } from '../../../features/inventorySlice';
import { ChatterMessage } from './ChatterMessage';
import { ChatterChoices } from './ChatterChoices';
import { getDialogueTreeByContact } from '../../../data/dialogueTrees';
import { INITIAL_EVIDENCE } from '../../../data/initialData';
import { DialogueChoice, AppId } from '../../../types';
import { logger } from '../../../utils/logger';

export function ChatterApp() {
  const dispatch = useDispatch();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { contacts, activeContactId, conversations, currentNodeId, isTyping, pendingChoices } =
    useSelector((state: RootState) => state.dialogue);

  const activeContact = contacts.find((c) => c.id === activeContactId);
  const activeConversation = activeContactId ? conversations[activeContactId] || [] : [];
  const activeCurrentNodeId = activeContactId ? currentNodeId[activeContactId] : null;

  // Get current dialogue node
  const dialogueTree = activeContactId ? getDialogueTreeByContact(activeContactId) : null;
  const currentNode = dialogueTree?.nodes.find((n) => n.id === activeCurrentNodeId);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation, isTyping]);

  // Process dialogue consequences
  const processConsequences = useCallback(
    (choice: DialogueChoice) => {
      choice.consequences.forEach((consequence) => {
        switch (consequence.type) {
          case 'unlock_app':
            dispatch(unlockApp(consequence.payload.appId as AppId));
            break;
          case 'unlock_process':
            dispatch(unlockProcess(consequence.payload.processId as string));
            break;
          case 'game_over':
            dispatch(
              setGameOver({
                reason: consequence.payload.reason as 'UNAUTHORIZED_SPEND',
                message: consequence.payload.message as string,
              })
            );
            break;
          case 'add_notification':
            dispatch(
              addNotification({
                id: `notif_${Date.now()}`,
                title: consequence.payload.title as string,
                message: consequence.payload.message as string,
                type: consequence.payload.type as 'info' | 'success' | 'warning' | 'error',
                duration: 5000,
              })
            );
            break;
          case 'update_stakeholder':
            const { stakeholderId, updates } = consequence.payload as {
              stakeholderId: string;
              updates: { attitude?: string; isIdentified?: boolean };
            };
            if (updates.isIdentified) {
              dispatch(identifyStakeholder(stakeholderId));
            }
            if (updates.attitude) {
              dispatch(
                updateStakeholderAttitude({
                  id: stakeholderId,
                  attitude: updates.attitude as 'Supportive' | 'Neutral' | 'Resistant',
                })
              );
            }
            break;
          case 'add_contact':
            dispatch(unlockContact(consequence.payload.contactId as string));
            dispatch(
              setContactUnread({
                contactId: consequence.payload.contactId as string,
                hasUnread: true,
              })
            );
            break;
          case 'add_inventory':
            const itemIds = consequence.payload.items as string[];
            itemIds.forEach((itemId) => {
              const evidenceItem = INITIAL_EVIDENCE.find((e) => e.id === itemId);
              if (evidenceItem) {
                dispatch(addItem(evidenceItem));
              }
            });
            break;
          case 'identify_stakeholder':
            dispatch(identifyStakeholder(consequence.payload.stakeholderId as string));
            break;
          case 'decompose_stakeholder':
            dispatch(decomposeStakeholder(consequence.payload.parentId as string));
            break;
          case 'update_constraint':
            dispatch(
              updateConstraint({
                metric: consequence.payload.metric as 'schedule' | 'budget' | 'morale' | 'scope',
                delta: consequence.payload.delta as number,
              })
            );
            break;
        }
      });
    },
    [dispatch]
  );

  // Start dialogue when opening a contact with unread messages
  useEffect(() => {
    if (activeContactId && dialogueTree && !activeCurrentNodeId) {
      // Start the dialogue if we haven't yet
      dispatch(
        startDialogue({
          contactId: activeContactId,
          startNodeId: dialogueTree.startNodeId,
        })
      );
    }
  }, [activeContactId, dialogueTree, activeCurrentNodeId, dispatch]);

  // Process current node (show typing, then message)
  useEffect(() => {
    if (!currentNode || !activeContactId) return;

    // Don't process if we already have this message in conversation
    const hasMessage = activeConversation.some((m) => m.nodeId === currentNode.id);
    if (hasMessage) {
      // If node has choices and we haven't selected one, show pending choices
      if (currentNode.choices && !pendingChoices) {
        dispatch(setPendingChoices(true));
      }
      return;
    }

    // Show typing indicator
    dispatch(setTyping(true));

    const typingDelay = currentNode.delay || 1000;
    const typingTimer = setTimeout(() => {
      dispatch(setTyping(false));

      // Add message to conversation
      dispatch(
        addMessage({
          contactId: activeContactId,
          message: {
            nodeId: currentNode.id,
            speaker: currentNode.speaker,
            text: currentNode.text,
            timestamp: Date.now(),
          },
        })
      );

      // If there are choices, wait for player input
      if (currentNode.choices) {
        dispatch(setPendingChoices(true));
      } else if (currentNode.autoAdvanceToNodeId) {
        // Auto-advance to next node after a short delay
        setTimeout(() => {
          dispatch(
            advanceDialogue({
              contactId: activeContactId,
              nextNodeId: currentNode.autoAdvanceToNodeId!,
            })
          );
        }, 500);
      }
    }, typingDelay);

    return () => clearTimeout(typingTimer);
  }, [currentNode, activeContactId, activeConversation, pendingChoices, dispatch]);

  // Handle choice selection
  const handleChoiceSelect = (choice: DialogueChoice) => {
    if (!activeContactId) return;

    logger.info('ChatterApp', 'Choice selected', {
      contactId: activeContactId,
      choiceId: choice.id,
      choiceLabel: choice.label,
      consequences: choice.consequences.map(c => c.type)
    });

    // Process consequences first
    processConsequences(choice);

    // Then update dialogue state
    dispatch(
      selectChoice({
        contactId: activeContactId,
        choiceLabel: choice.label,
        nextNodeId: choice.nextNodeId,
      })
    );
  };

  // Filter to only unlocked contacts
  const unlockedContacts = contacts.filter((c) => c.isUnlocked);

  return (
    <div className="flex h-full bg-slate-900">
      {/* Sidebar - Contact List */}
      <div className="w-64 border-r border-slate-700 flex flex-col">
        <div className="p-3 border-b border-slate-700">
          <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
            <MessageCircle size={16} />
            Chatter
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {unlockedContacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => dispatch(setActiveContact(contact.id))}
              className={`w-full p-3 flex items-center gap-3 hover:bg-slate-800 transition-colors ${
                activeContactId === contact.id ? 'bg-slate-800' : ''
              }`}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                  {contact.avatarUrl ? (
                    <img
                      src={contact.avatarUrl}
                      alt={contact.name}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <User size={20} className="text-slate-400" />
                  )}
                </div>
                {contact.hasUnreadMessages && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center"
                  >
                    <span className="text-[10px] text-white font-bold">1</span>
                  </motion.div>
                )}
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="text-sm font-medium text-slate-200 truncate">{contact.name}</div>
                <div className="text-xs text-slate-500 truncate">{contact.role}</div>
                {contact.lastMessage && (
                  <div className="text-xs text-slate-400 truncate mt-0.5">
                    {contact.lastMessage}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeContact ? (
          <>
            {/* Chat Header */}
            <div className="p-3 border-b border-slate-700 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                <User size={16} className="text-slate-400" />
              </div>
              <div>
                <div className="text-sm font-medium text-slate-200">{activeContact.name}</div>
                <div className="text-xs text-slate-500">{activeContact.role}</div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4">
              <AnimatePresence>
                {activeConversation.map((msg, index) => (
                  <ChatterMessage
                    key={`${msg.nodeId}-${index}`}
                    speaker={msg.speaker}
                    text={msg.text}
                    isPlayer={msg.isPlayerChoice}
                    isSystem={msg.speaker === 'System'}
                  />
                ))}
              </AnimatePresence>

              {/* Typing Indicator */}
              {isTyping && currentNode && (
                <ChatterMessage
                  speaker={currentNode.speaker}
                  speakerAvatar={currentNode.speakerAvatar}
                  text=""
                  isTyping
                />
              )}

              {/* Choice Buttons */}
              {pendingChoices && currentNode?.choices && (
                <ChatterChoices choices={currentNode.choices} onSelect={handleChoiceSelect} />
              )}

              <div ref={messagesEndRef} />
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex items-center justify-center text-slate-500">
            <div className="text-center">
              <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
              <p>Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
