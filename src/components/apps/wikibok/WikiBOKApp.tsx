import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  BookOpen,
  Workflow,
  Wrench,
  Lightbulb,
  ChevronRight,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';
import {
  WIKI_ARTICLES,
  WIKI_CATEGORIES,
  WikiArticle,
  getArticleById,
  getArticlesByCategory,
  searchArticles,
} from '../../../data/wikibok';

// Simple markdown-like rendering for content
const renderContent = (content: string): JSX.Element[] => {
  const lines = content.split('\n');
  const elements: JSX.Element[] = [];

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('# ')) {
      elements.push(
        <h1 key={index} className="text-2xl font-bold text-gray-800 mt-4 mb-2">
          {trimmed.slice(2)}
        </h1>
      );
    } else if (trimmed.startsWith('## ')) {
      elements.push(
        <h2 key={index} className="text-xl font-semibold text-gray-700 mt-6 mb-2">
          {trimmed.slice(3)}
        </h2>
      );
    } else if (trimmed.startsWith('### ')) {
      elements.push(
        <h3 key={index} className="text-lg font-semibold text-gray-700 mt-4 mb-1">
          {trimmed.slice(4)}
        </h3>
      );
    } else if (trimmed.startsWith('| ') && trimmed.endsWith(' |')) {
      // Simple table row - just render as formatted text
      const cells = trimmed.slice(1, -1).split('|').map(c => c.trim());
      elements.push(
        <div key={index} className="grid grid-cols-4 gap-2 py-1 text-sm font-mono bg-gray-50 px-2 border-b border-gray-200">
          {cells.map((cell, i) => (
            <span key={i} className={i === 0 ? 'font-medium' : ''}>{cell}</span>
          ))}
        </div>
      );
    } else if (trimmed.startsWith('- **')) {
      // Bold list item
      const match = trimmed.match(/- \*\*(.+?)\*\*:?\s*(.+)?/);
      if (match) {
        elements.push(
          <li key={index} className="ml-4 text-gray-600 mb-1">
            <strong className="text-gray-800">{match[1]}</strong>
            {match[2] && `: ${match[2]}`}
          </li>
        );
      }
    } else if (trimmed.startsWith('- ')) {
      elements.push(
        <li key={index} className="ml-4 text-gray-600 mb-1">
          {trimmed.slice(2)}
        </li>
      );
    } else if (/^\d+\./.test(trimmed)) {
      const match = trimmed.match(/^\d+\.\s*\*\*(.+?)\*\*:?\s*(.+)?/) || trimmed.match(/^\d+\.\s*(.+)/);
      if (match) {
        elements.push(
          <li key={index} className="ml-4 text-gray-600 mb-1 list-decimal">
            {match[2] ? (
              <>
                <strong className="text-gray-800">{match[1]}</strong>: {match[2]}
              </>
            ) : (
              match[1]
            )}
          </li>
        );
      }
    } else if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
      elements.push(
        <p key={index} className="font-semibold text-gray-700 mt-2">
          {trimmed.slice(2, -2)}
        </p>
      );
    } else if (trimmed) {
      // Regular paragraph - handle inline bold
      const parts = trimmed.split(/(\*\*.+?\*\*)/g);
      elements.push(
        <p key={index} className="text-gray-600 mb-2">
          {parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={i} className="text-gray-800">{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </p>
      );
    }
  });

  return elements;
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Process':
      return <Workflow size={16} />;
    case 'Tool':
      return <Wrench size={16} />;
    case 'Concept':
      return <Lightbulb size={16} />;
    default:
      return <BookOpen size={16} />;
  }
};

interface SidebarProps {
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
  onArticleSelect: (id: string) => void;
  searchQuery: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedCategory,
  onCategorySelect,
  onArticleSelect,
  searchQuery,
}) => {
  const filteredArticles = useMemo(() => {
    if (searchQuery) {
      return searchArticles(searchQuery);
    }
    if (selectedCategory) {
      return getArticlesByCategory(selectedCategory);
    }
    return WIKI_ARTICLES;
  }, [searchQuery, selectedCategory]);

  return (
    <div className="w-64 bg-slate-800 flex flex-col h-full">
      {/* Categories */}
      <div className="p-3 border-b border-slate-700">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Categories
        </h3>
        <div className="space-y-1">
          <button
            onClick={() => onCategorySelect(null)}
            className={`w-full px-3 py-1.5 text-sm text-left rounded transition-colors ${
              selectedCategory === null
                ? 'bg-purple-600 text-white'
                : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            All Articles
          </button>
          {WIKI_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategorySelect(cat.label)}
              className={`w-full px-3 py-1.5 text-sm text-left rounded transition-colors flex items-center gap-2 ${
                selectedCategory === cat.label
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Article List */}
      <div className="flex-1 overflow-y-auto p-3">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Articles ({filteredArticles.length})
        </h3>
        <div className="space-y-1">
          {filteredArticles.map((article) => (
            <button
              key={article.id}
              onClick={() => onArticleSelect(article.id)}
              className="w-full px-3 py-2 text-sm text-left rounded hover:bg-slate-700 transition-colors group"
            >
              <div className="flex items-start gap-2">
                <span className="text-slate-400 mt-0.5">{getCategoryIcon(article.category)}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-slate-200 group-hover:text-white truncate">
                    {article.title}
                  </div>
                  <div className="text-xs text-slate-500">{article.category}</div>
                </div>
                <ChevronRight size={14} className="text-slate-500 opacity-0 group-hover:opacity-100 mt-1" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

interface ArticleViewProps {
  article: WikiArticle;
  onNavigate: (id: string) => void;
  onBack: () => void;
}

const ArticleView: React.FC<ArticleViewProps> = ({ article, onNavigate, onBack }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="h-full overflow-y-auto"
    >
      {/* Article Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-2"
        >
          <ArrowLeft size={14} />
          Back to list
        </button>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${
            article.category === 'Process' ? 'bg-blue-100 text-blue-600' :
            article.category === 'Tool' ? 'bg-green-100 text-green-600' :
            'bg-purple-100 text-purple-600'
          }`}>
            {getCategoryIcon(article.category)}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">{article.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs px-2 py-0.5 bg-gray-100 rounded text-gray-600">
                {article.category}
              </span>
              {article.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-xs text-gray-400">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="px-6 py-4">
        <div className="prose prose-sm max-w-none">
          {renderContent(article.content)}
        </div>

        {/* Related Articles */}
        {article.relatedArticles && article.relatedArticles.length > 0 && (
          <div className="mt-8 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Related Articles</h3>
            <div className="flex flex-wrap gap-2">
              {article.relatedArticles.map((relatedId) => {
                const related = getArticleById(relatedId);
                if (!related) return null;
                return (
                  <button
                    key={relatedId}
                    onClick={() => onNavigate(relatedId)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
                  >
                    {related.title}
                    <ExternalLink size={12} />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export const WikiBOKApp: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  const selectedArticle = selectedArticleId ? getArticleById(selectedArticleId) : null;

  return (
    <div className="flex h-full bg-white">
      {/* Sidebar */}
      <Sidebar
        selectedCategory={selectedCategory}
        onCategorySelect={(cat) => {
          setSelectedCategory(cat);
          setSelectedArticleId(null);
        }}
        onArticleSelect={setSelectedArticleId}
        searchQuery={searchQuery}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search WikiBOK..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedArticleId(null);
              }}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none text-sm"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {selectedArticle ? (
              <ArticleView
                key={selectedArticle.id}
                article={selectedArticle}
                onNavigate={setSelectedArticleId}
                onBack={() => setSelectedArticleId(null)}
              />
            ) : (
              <motion.div
                key="welcome"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center p-8"
              >
                <BookOpen size={64} className="text-gray-300 mb-4" />
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                  Welcome to WikiBOK
                </h2>
                <p className="text-gray-500 max-w-md">
                  Your in-game reference for PMBOK Guide concepts. Search for topics or browse
                  by category to learn about project management processes, tools, and techniques.
                </p>
                <div className="mt-6 flex gap-2">
                  {['charter', 'stakeholder', 'conflict'].map((term) => (
                    <button
                      key={term}
                      onClick={() => setSearchQuery(term)}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-600"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
