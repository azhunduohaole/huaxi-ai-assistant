import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Activity,
  BarChart3,
  BellRing,
  BookOpen,
  Bot,
  BrainCircuit,
  CheckCircle2,
  ChevronDown,
  CirclePause,
  Clipboard,
  Clock3,
  Database,
  Download,
  ExternalLink,
  FileDown,
  FileText,
  FolderCog,
  Globe2,
  LayoutDashboard,
  Menu,
  MessageSquarePlus,
  MoreHorizontal,
  PanelRightOpen,
  Pin,
  Plus,
  Search,
  SendHorizontal,
  Settings2,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  X,
  Zap
} from 'lucide-react';
import './styles.css';

type Mode = 'secretary' | 'badchild';
type View = 'chat' | 'history' | 'tasks' | 'knowledge' | 'admin';

type Session = {
  id: string;
  title: string;
  type: Mode;
  pinned?: boolean;
  preview: string;
  time: string;
  count: number;
};

type KnowledgeBase = {
  id: string;
  name: string;
  desc: string;
  files: number;
  owner: string;
  status: 'ready' | 'processing';
};

type Task = {
  name: string;
  focus: string;
  frequency: string;
  rounds: number;
  latest: string;
  next: string;
  status: 'enabled' | 'disabled' | 'abnormal';
};

const sessions: Session[] = [
  {
    id: 's1',
    title: '麦角硫因功效综述',
    type: 'secretary',
    pinned: true,
    preview: '已检索配方库、实验报告与法规条款',
    time: '刚刚',
    count: 18
  },
  {
    id: 's2',
    title: '外泌体技术迁移',
    type: 'badchild',
    pinned: true,
    preview: '生成创新路径与风险初判报告',
    time: '12分钟前',
    count: 9
  },
  {
    id: 's3',
    title: '透明质酸口服趋势',
    type: 'badchild',
    preview: '正在整理专利空白与竞品布局',
    time: '2小时前',
    count: 12
  },
  {
    id: 's4',
    title: '功效宣称内部规范',
    type: 'secretary',
    preview: '引用《化妆品功效宣称评价规范》',
    time: '2026-06-20',
    count: 7
  }
];

const knowledgeBases: KnowledgeBase[] = [
  { id: 'kb1', name: '合成生物学研发库', desc: '菌株构建、发酵工艺、活性物质生产资料', files: 1286, owner: '研发中心', status: 'ready' },
  { id: 'kb2', name: '皮肤科学临床证据库', desc: '功效评估、临床数据、人体试验报告', files: 842, owner: '功效评价部', status: 'processing' },
  { id: 'kb3', name: '法规与竞品情报库', desc: '国内外政策、备案、竞品专利与新闻', files: 611, owner: '战略情报组', status: 'ready' }
];

const tasks: Task[] = [
  {
    name: '麦角硫因最新数据周报',
    focus: '专利、论文、法规、竞品动态',
    frequency: '每周一 09:00',
    rounds: 8,
    latest: '2026-06-22 09:00',
    next: '2026-06-29 09:00',
    status: 'enabled'
  },
  {
    name: '重组胶原蛋白法规日报',
    focus: '中国、欧盟、东南亚法规更新',
    frequency: '每天 08:00',
    rounds: 31,
    latest: '2026-06-22 08:00',
    next: '2026-06-23 08:00',
    status: 'enabled'
  },
  {
    name: '外泌体护肤专利监测',
    focus: '国际申请、竞品布局、技术路线',
    frequency: '每周五 10:00',
    rounds: 3,
    latest: '2026-06-19 10:00',
    next: '待恢复',
    status: 'abnormal'
  }
];

const sources = [
  {
    title: '麦角硫因功效验证实验报告_2025.pdf',
    source: '知识库',
    meta: '研发中心 · 2025-11-18 · DOI: 10.1249/HY.2025.031'
  },
  {
    title: '皮肤屏障修护机制综述.docx',
    source: '知识库',
    meta: '功效评价部 · 2026-02-02 · DOI: 10.2147/BARRIER.116'
  },
  {
    title: 'Global EGT skincare patent trend',
    source: 'patentscope.wipo.int',
    meta: 'WIPO · 2026-05-09 · DOI: 10.6060/WIPO.EGT'
  }
];

const journey = [
  { label: '需求解析', desc: '识别原料、功效、应用场景', done: true },
  { label: '信息检索', desc: '搜索引擎 + 企业知识库并行召回', done: true },
  { label: '资料整理', desc: '按可信度、时间热度、权威度重排', done: true },
  { label: '报告生成', desc: '组织技术综述与创新机会', done: false }
];

function App() {
  const [view, setView] = useState<View>('chat');
  const [mode, setMode] = useState<Mode>('secretary');
  const [activeSession, setActiveSession] = useState(sessions[0].id);
  const [query, setQuery] = useState('');
  const [searchText, setSearchText] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 1180);
  const [kbModalOpen, setKbModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [smartSearch, setSmartSearch] = useState(false);
  const [selectedKbs, setSelectedKbs] = useState(['kb1', 'kb2']);
  const [scene, setScene] = useState('技术综述');
  const [style, setStyle] = useState('严谨');

  const filteredSessions = useMemo(() => {
    const key = searchText.trim().toLowerCase();
    const list = key ? sessions.filter((item) => item.title.toLowerCase().includes(key)) : sessions;
    return [...list].sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)));
  }, [searchText]);

  const currentSession = sessions.find((item) => item.id === activeSession) ?? sessions[0];
  const currentMode = mode || currentSession.type;

  const chooseSession = (session: Session) => {
    setActiveSession(session.id);
    setMode(session.type);
    setView('chat');
    setMobileMenuOpen(false);
  };

  const send = () => {
    if (!query.trim()) return;
    setQuery('');
    setView('chat');
  };

  return (
    <div className="app-shell">
      <aside className="global-rail" aria-label="全局导航">
        <div className="brand-mark" aria-label="华熙AI">
          HX
        </div>
        <button className="rail-button active" aria-label="AI助手">
          <Bot size={21} />
        </button>
        <button className="rail-button" aria-label="知识库">
          <Database size={21} />
        </button>
        <button className="rail-button" aria-label="消息">
          <BellRing size={21} />
        </button>
        <button className="rail-button rail-bottom" aria-label="设置">
          <Settings2 size={21} />
        </button>
      </aside>

      <aside className={`workspace-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-head">
          <div>
            <p className="eyebrow">华熙生物</p>
            <h1>AI知识助手</h1>
          </div>
          <button className="icon-button hide-desktop" aria-label="关闭菜单" onClick={() => setMobileMenuOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <button className="new-chat-button" onClick={() => setView('chat')}>
          <MessageSquarePlus size={18} />
          新建会话
        </button>

        <nav className="nav-list" aria-label="应用导航">
          <NavItem icon={<LayoutDashboard size={18} />} label="会话工作台" active={view === 'chat'} onClick={() => setView('chat')} />
          <NavItem icon={<Clock3 size={18} />} label="历史对话" active={view === 'history'} onClick={() => setView('history')} />
          <NavItem icon={<BellRing size={18} />} label="定时任务" active={view === 'tasks'} onClick={() => setView('tasks')} />
          <NavItem icon={<FolderCog size={18} />} label="知识库管理" active={view === 'knowledge'} onClick={() => setView('knowledge')} />
          <NavItem icon={<BarChart3 size={18} />} label="管理员应用" active={view === 'admin'} onClick={() => setView('admin')} />
        </nav>

        <div className="session-search">
          <Search size={16} />
          <label className="sr-only" htmlFor="session-search">
            搜索会话名称
          </label>
          <input id="session-search" value={searchText} onChange={(event) => setSearchText(event.target.value)} placeholder="搜索会话名称" />
          {searchText && (
            <button aria-label="清空搜索" onClick={() => setSearchText('')}>
              <X size={14} />
            </button>
          )}
        </div>

        <div className="session-list" aria-label="历史会话">
          {filteredSessions.map((session) => (
            <button key={session.id} className={`session-card ${activeSession === session.id ? 'selected' : ''}`} onClick={() => chooseSession(session)}>
              <span className={`mode-dot ${session.type}`} />
              <span className="session-main">
                <span className="session-title">
                  {session.pinned && <Pin size={13} />}
                  {highlight(session.title, searchText)}
                </span>
                <span className="session-preview">{session.preview}</span>
              </span>
              <span className="session-time">{session.time}</span>
            </button>
          ))}
        </div>
      </aside>

      <main className="main-stage">
        <header className="topbar">
          <button className="icon-button hide-desktop" aria-label="打开菜单" onClick={() => setMobileMenuOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="page-title">
            <p>{viewLabel(view)}</p>
            <strong>{view === 'chat' ? currentSession.title : '华熙AI研发知识工作台'}</strong>
          </div>
          <div className="topbar-actions">
            <button className="ghost-button">
              <ShieldCheck size={16} />
              企业私有知识
            </button>
            <button className="icon-button" aria-label="打开来源抽屉" onClick={() => setDrawerOpen(!drawerOpen)}>
              <PanelRightOpen size={19} />
            </button>
          </div>
        </header>

        {view === 'chat' && (
          <ChatView
            mode={currentMode}
            setMode={setMode}
            query={query}
            setQuery={setQuery}
            send={send}
            drawerOpen={drawerOpen}
            setDrawerOpen={setDrawerOpen}
            setKbModalOpen={setKbModalOpen}
            smartSearch={smartSearch}
            setSmartSearch={setSmartSearch}
            selectedKbs={selectedKbs}
            scene={scene}
            setScene={setScene}
            style={style}
            setStyle={setStyle}
          />
        )}
        {view === 'history' && <HistoryView sessions={filteredSessions} chooseSession={chooseSession} />}
        {view === 'tasks' && <TasksView />}
        {view === 'knowledge' && <KnowledgeView />}
        {view === 'admin' && <AdminView />}
      </main>

      {view === 'chat' && drawerOpen && <SourceDrawer onClose={() => setDrawerOpen(false)} />}
      {kbModalOpen && <KnowledgeModal selectedKbs={selectedKbs} setSelectedKbs={setSelectedKbs} onClose={() => setKbModalOpen(false)} />}
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>
      {icon}
      {label}
    </button>
  );
}

function ChatView({
  mode,
  setMode,
  query,
  setQuery,
  send,
  drawerOpen,
  setDrawerOpen,
  setKbModalOpen,
  smartSearch,
  setSmartSearch,
  selectedKbs,
  scene,
  setScene,
  style,
  setStyle
}: {
  mode: Mode;
  setMode: (mode: Mode) => void;
  query: string;
  setQuery: (query: string) => void;
  send: () => void;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  setKbModalOpen: (open: boolean) => void;
  smartSearch: boolean;
  setSmartSearch: (open: boolean) => void;
  selectedKbs: string[];
  scene: string;
  setScene: (scene: string) => void;
  style: string;
  setStyle: (style: string) => void;
}) {
  return (
    <section className={`chat-layout ${drawerOpen ? 'with-drawer' : ''}`}>
      <div className="chat-column">
        <div className="agent-hero">
          <AssistantAvatar mode={mode} />
          <div>
            <p className="eyebrow">{mode === 'secretary' ? '小秘书 · 精准知识检索' : '坏孩子 · 创新探索'}</p>
            <h2>{mode === 'secretary' ? '严格基于已知事实作答，句句可溯源' : '用 DeepResearch 跑完从假设到报告的研究闭环'}</h2>
            <p className="hero-copy">
              {mode === 'secretary'
                ? '接入企业知识库、临时文件与智能搜索，适合内部实验记录、法规规范、技术文档问答。'
                : '面向开放性研发问题，自动拆解意图、并行检索、整理证据并输出方向洞察或科普报告。'}
            </p>
          </div>
          <ModeSwitch mode={mode} setMode={setMode} />
        </div>

        <div className="conversation">
          <Message role="user" text={mode === 'secretary' ? '请梳理麦角硫因在皮肤抗氧化方向的内部验证结论。' : '外泌体技术迁移到功效护肤有哪些可行路径？'} />
          {mode === 'secretary' ? <SecretaryAnswer setDrawerOpen={setDrawerOpen} /> : <BadChildAnswer />}
        </div>

        <Composer
          mode={mode}
          query={query}
          setQuery={setQuery}
          send={send}
          setKbModalOpen={setKbModalOpen}
          smartSearch={smartSearch}
          setSmartSearch={setSmartSearch}
          selectedKbs={selectedKbs}
          scene={scene}
          setScene={setScene}
          style={style}
          setStyle={setStyle}
        />
      </div>
    </section>
  );
}

function AssistantAvatar({ mode }: { mode: Mode }) {
  return (
    <div className={`assistant-avatar ${mode}`} aria-hidden="true">
      <div className="avatar-hair" />
      <div className="avatar-face">
        <span />
        <span />
      </div>
      <div className="avatar-coat" />
      <div className="avatar-spark">
        <Sparkles size={15} />
      </div>
    </div>
  );
}

function ModeSwitch({ mode, setMode }: { mode: Mode; setMode: (mode: Mode) => void }) {
  return (
    <div className="mode-switch" role="tablist" aria-label="智能体切换">
      <button className={mode === 'secretary' ? 'active' : ''} onClick={() => setMode('secretary')} role="tab" aria-selected={mode === 'secretary'}>
        <Bot size={16} />
        小秘书
      </button>
      <button className={mode === 'badchild' ? 'active' : ''} onClick={() => setMode('badchild')} role="tab" aria-selected={mode === 'badchild'}>
        <BrainCircuit size={16} />
        坏孩子
      </button>
    </div>
  );
}

function Message({ role, text }: { role: 'user' | 'assistant'; text: string }) {
  return (
    <div className={`message ${role}`}>
      <div className="bubble">{text}</div>
    </div>
  );
}

function SecretaryAnswer({ setDrawerOpen }: { setDrawerOpen: (open: boolean) => void }) {
  return (
    <div className="message assistant">
      <div className="answer-card">
        <div className="answer-head">
          <span className="status-chip blue">
            <CheckCircle2 size={15} />
            已完成
          </span>
          <div className="answer-actions">
            <button>
              <Clipboard size={15} />
              复制
            </button>
            <button onClick={() => setDrawerOpen(true)}>
              <Search size={15} />
              搜索结果
            </button>
          </div>
        </div>
        <p>
          内部资料显示，麦角硫因在皮肤抗氧化方向的验证重点集中在降低 ROS 累积、缓解 UVB 诱导的炎症因子释放、增强屏障修护相关指标三类。
          <SourceTag index={1} />
        </p>
        <p>
          现有配方测试中，0.05%-0.2% 添加区间对细胞保护效果更稳定；若与透明质酸体系复配，建议优先验证水相稳定性与长期色泽变化。
          <SourceTag index={2} />
        </p>
        <div className="evidence-grid">
          <Evidence label="召回文档" value="26" />
          <Evidence label="平均置信度" value="91%" />
          <Evidence label="最新来源" value="2026-05" />
        </div>
      </div>
    </div>
  );
}

function SourceTag({ index }: { index: number }) {
  return (
    <span className="source-tag" tabIndex={0}>
      [{index}]
      <span className="source-popover">
        <strong>{sources[index - 1].title}</strong>
        <small>{sources[index - 1].meta}</small>
        <button>
          查看原文
          <ExternalLink size={13} />
        </button>
      </span>
    </span>
  );
}

function Evidence({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function BadChildAnswer() {
  return (
    <div className="message assistant">
      <div className="answer-card badchild-card">
        <div className="research-path">
          {journey.map((step, index) => (
            <div className={`path-step ${step.done ? 'done' : 'running'}`} key={step.label}>
              <span>{step.done ? <CheckCircle2 size={16} /> : <Activity size={16} />}</span>
              <div>
                <strong>{index + 1}. {step.label}</strong>
                <small>{step.desc}</small>
              </div>
            </div>
          ))}
        </div>
        <h3>外泌体技术迁移到功效护肤的三条机会路径</h3>
        <p>
          初步判断，最具落地性的方向是屏障修护信号递送、炎症微环境调节、以及与透明质酸/胶原体系的复合载体开发。近期布局应先做安全边界、来源一致性和功效宣称合规评估。
        </p>
        <div className="report-card">
          <FileText size={28} />
          <div>
            <strong>外泌体护肤创新路径规划报告</strong>
            <span>Markdown 预览 · 17 页 · 参考文献 42 条</span>
          </div>
          <button>
            <Download size={16} />
            下载
          </button>
        </div>
      </div>
    </div>
  );
}

function Composer({
  mode,
  query,
  setQuery,
  send,
  setKbModalOpen,
  smartSearch,
  setSmartSearch,
  selectedKbs,
  scene,
  setScene,
  style,
  setStyle
}: {
  mode: Mode;
  query: string;
  setQuery: (query: string) => void;
  send: () => void;
  setKbModalOpen: (open: boolean) => void;
  smartSearch: boolean;
  setSmartSearch: (open: boolean) => void;
  selectedKbs: string[];
  scene: string;
  setScene: (scene: string) => void;
  style: string;
  setStyle: (style: string) => void;
}) {
  return (
    <div className="composer">
      <label className="sr-only" htmlFor="chat-input">
        输入会话信息
      </label>
      <textarea
        id="chat-input"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={(event) => {
          if (event.ctrlKey && event.key === 'Enter') send();
        }}
        placeholder={mode === 'secretary' ? '问问内部实验、配方、法规或临床资料...' : '输入一个开放式探索问题，例如“抗衰方向还有哪些技术空白？”'}
      />
      <div className="composer-tools">
        <button className={smartSearch ? 'tool active' : 'tool'} onClick={() => setSmartSearch(!smartSearch)}>
          <Globe2 size={16} />
          智能搜索
        </button>
        <button className="tool" onClick={() => setKbModalOpen(true)}>
          <BookOpen size={16} />
          知识库({selectedKbs.length})
        </button>
        {mode === 'secretary' && (
          <button className="tool">
            <UploadCloud size={16} />
            临时文件
          </button>
        )}
        <SelectPill value={scene} options={mode === 'secretary' ? ['技术综述'] : ['技术综述', '方向洞察', '科学传播']} onChange={setScene} icon={<Zap size={16} />} />
        {mode === 'badchild' && scene === '科学传播' && <SelectPill value={style} options={['通用', '严谨']} onChange={setStyle} icon={<Sparkles size={16} />} />}
        <button className="pause-button" aria-label="暂停生成">
          <CirclePause size={18} />
        </button>
        <button className="send-button" onClick={send} aria-label="发送消息">
          <SendHorizontal size={20} />
        </button>
      </div>
    </div>
  );
}

function SelectPill({ value, options, onChange, icon }: { value: string; options: string[]; onChange: (value: string) => void; icon: React.ReactNode }) {
  return (
    <label className="select-pill">
      {icon}
      <span className="sr-only">选择模板</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      <ChevronDown size={14} />
    </label>
  );
}

function SourceDrawer({ onClose }: { onClose: () => void }) {
  return (
    <aside className="source-drawer" aria-label="搜索结果">
      <div className="drawer-head">
        <div>
          <p className="eyebrow">本轮检索</p>
          <h2>搜索结果</h2>
        </div>
        <button className="icon-button" aria-label="关闭来源抽屉" onClick={onClose}>
          <X size={18} />
        </button>
      </div>
      <div className="source-summary">
        <strong>26</strong>
        <span>条召回结果，已按相关性、权威度和时间热度重排。</span>
      </div>
      <div className="source-list">
        {sources.map((source, index) => (
          <button key={source.title} className="source-item">
            <span>{index + 1}</span>
            <div>
              <strong>{source.title}</strong>
              <small>{source.source}</small>
              <em>{source.meta}</em>
            </div>
            <ExternalLink size={16} />
          </button>
        ))}
      </div>
    </aside>
  );
}

function KnowledgeModal({ selectedKbs, setSelectedKbs, onClose }: { selectedKbs: string[]; setSelectedKbs: (ids: string[]) => void; onClose: () => void }) {
  const toggle = (id: string) => {
    setSelectedKbs(selectedKbs.includes(id) ? selectedKbs.filter((item) => item !== id) : [...selectedKbs, id]);
  };

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="kb-title">
        <div className="modal-head">
          <div>
            <p className="eyebrow">工具配置</p>
            <h2 id="kb-title">选择知识库</h2>
          </div>
          <button className="icon-button" aria-label="关闭弹窗" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="kb-picker">
          <div className="kb-options">
            {knowledgeBases.map((kb) => (
              <label key={kb.id} className="kb-option">
                <input type="checkbox" checked={selectedKbs.includes(kb.id)} onChange={() => toggle(kb.id)} />
                <span>
                  <strong>{kb.name}</strong>
                  <small>{kb.files} 个文件 · {kb.owner}</small>
                </span>
              </label>
            ))}
          </div>
          <div className="kb-picked">
            <h3>已选汇总</h3>
            <strong>{selectedKbs.length} 个知识库</strong>
            <p>配置确认后，将对当前会话后续问题实时生效，历史答案不受影响。</p>
          </div>
        </div>
        <footer className="modal-actions">
          <button className="ghost-button" onClick={onClose}>取消</button>
          <button className="primary-button" onClick={onClose}>确认</button>
        </footer>
      </section>
    </div>
  );
}

function HistoryView({ sessions, chooseSession }: { sessions: Session[]; chooseSession: (session: Session) => void }) {
  return (
    <section className="content-view">
      <div className="section-head">
        <div>
          <p className="eyebrow">会话管理</p>
          <h2>全部历史对话</h2>
        </div>
        <button className="primary-button">
          <Plus size={16} />
          新建会话
        </button>
      </div>
      <div className="history-grid">
        {sessions.map((session) => (
          <article className="history-card" key={session.id} onClick={() => chooseSession(session)}>
            <div className="history-card-head">
              <span className={`mode-label ${session.type}`}>{session.type === 'secretary' ? '小秘书' : '坏孩子'}</span>
              <button className="icon-button" aria-label="更多操作">
                <MoreHorizontal size={18} />
              </button>
            </div>
            <h3>{session.title}</h3>
            <p>{session.preview}</p>
            <footer>
              <span>{session.count} 条消息</span>
              <span>{session.time}</span>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}

function TasksView() {
  return (
    <section className="content-view">
      <div className="task-create">
        <div>
          <p className="eyebrow">情报中枢</p>
          <h2>创建定时任务</h2>
          <p>输入关注领域，AI 自动生成日报/周报并推送至飞书。</p>
        </div>
        <label>
          <span>关注领域</span>
          <input placeholder="例如：重组胶原蛋白法规动态" />
        </label>
        <label>
          <span>发布频次</span>
          <select defaultValue="每周">
            <option>每天</option>
            <option>每周</option>
          </select>
        </label>
        <button className="primary-button">
          <BellRing size={16} />
          发布任务
        </button>
      </div>
      <div className="table-card">
        <TableHeader columns={['任务名称', '状态', '发布频次', '已执行', '最新执行', '下次执行', '操作']} />
        {tasks.map((task) => (
          <div className="table-row" key={task.name}>
            <div>
              <strong>{task.name}</strong>
              <small>{task.focus}</small>
            </div>
            <Status status={task.status} />
            <span>{task.frequency}</span>
            <span>{task.rounds} 轮</span>
            <span>{task.latest}</span>
            <span>{task.next}</span>
            <div className="row-actions">
              <button>测试</button>
              <button>{task.status === 'disabled' ? '启用' : '终止'}</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function KnowledgeView() {
  return (
    <section className="content-view">
      <div className="section-head">
        <div>
          <p className="eyebrow">企业知识中枢</p>
          <h2>知识库管理</h2>
        </div>
        <div className="split-actions">
          <button className="ghost-button">
            <UploadCloud size={16} />
            上传文件
          </button>
          <button className="primary-button">
            <Plus size={16} />
            创建知识库
          </button>
        </div>
      </div>
      <div className="kb-grid">
        {knowledgeBases.map((kb) => (
          <article className="kb-card" key={kb.id}>
            <div className="kb-icon">
              <Database size={22} />
            </div>
            <div>
              <h3>{kb.name}</h3>
              <p>{kb.desc}</p>
              <footer>
                <span>{kb.files} 个文件</span>
                <span>{kb.owner}</span>
                <Status status={kb.status === 'ready' ? 'enabled' : 'disabled'} />
              </footer>
            </div>
          </article>
        ))}
      </div>
      <div className="table-card">
        <TableHeader columns={['文件名', '所属知识库', '格式', '状态', '上传时间', '操作']} />
        {['外泌体护肤功效综述.pdf', '麦角硫因稳定性实验.xlsx', '化妆品功效宣称规范.docx'].map((file, index) => (
          <div className="table-row file-row" key={file}>
            <div>
              <FileText size={18} />
              <strong>{file}</strong>
            </div>
            <span>{knowledgeBases[index].name}</span>
            <span>{file.split('.').pop()?.toUpperCase()}</span>
            <Status status={index === 1 ? 'disabled' : 'enabled'} />
            <span>2026-06-{18 + index}</span>
            <div className="row-actions">
              <button>
                <FileDown size={14} />
                下载
              </button>
              <button>删除</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function AdminView() {
  return (
    <section className="content-view">
      <div className="section-head">
        <div>
          <p className="eyebrow">管理员应用</p>
          <h2>数据监控与模板配置</h2>
        </div>
        <button className="primary-button">
          <Plus size={16} />
          创建模板
        </button>
      </div>
      <div className="quota-grid">
        <Quota title="小秘书 · 非联网" used={6240} total={10000} />
        <Quota title="小秘书 · 联网" used={1390} total={3000} />
        <Quota title="坏孩子" used={286} total={800} />
      </div>
      <div className="template-grid">
        {['通用科普', '严谨科研', '董事会摘要'].map((item) => (
          <article className="template-card" key={item}>
            <div>
              <span className="mode-label badchild">科学传播</span>
              <h3>{item}</h3>
              <p>用于坏孩子报告输出风格，可约束语气、引用密度与段落结构。</p>
            </div>
            <button className="ghost-button">编辑</button>
          </article>
        ))}
      </div>
    </section>
  );
}

function Quota({ title, used, total }: { title: string; used: number; total: number }) {
  const percent = Math.round((used / total) * 100);
  return (
    <article className="quota-card">
      <span>{title}</span>
      <strong>{used.toLocaleString()}</strong>
      <p>总额度 {total.toLocaleString()} · 剩余 {(total - used).toLocaleString()}</p>
      <div className="progress">
        <i style={{ width: `${percent}%` }} />
      </div>
    </article>
  );
}

function Status({ status }: { status: 'enabled' | 'disabled' | 'abnormal' }) {
  const label = status === 'enabled' ? '启用中' : status === 'disabled' ? '处理中' : '异常';
  return <span className={`status ${status}`}>{label}</span>;
}

function TableHeader({ columns }: { columns: string[] }) {
  return (
    <div className="table-header">
      {columns.map((column) => (
        <span key={column}>{column}</span>
      ))}
    </div>
  );
}

function highlight(text: string, keyword: string) {
  if (!keyword.trim()) return text;
  const index = text.toLowerCase().indexOf(keyword.toLowerCase());
  if (index < 0) return text;
  return (
    <>
      {text.slice(0, index)}
      <mark>{text.slice(index, index + keyword.length)}</mark>
      {text.slice(index + keyword.length)}
    </>
  );
}

function viewLabel(view: View) {
  return {
    chat: '会话详情',
    history: '历史对话',
    tasks: '定时任务',
    knowledge: '知识库管理',
    admin: '管理员应用'
  }[view];
}

createRoot(document.getElementById('root')!).render(<App />);
