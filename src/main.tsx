import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const secretaryAvatarUrl = new URL('./assets/huaxi-secretary.jpg', import.meta.url).href;
const badchildAvatarUrl = new URL('./assets/huaxi-badchild.jpg', import.meta.url).href;

type IconProps = { size?: number; className?: string };

const iconStroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
const makeIcon =
  (children: React.ReactNode) =>
  ({ size = 20, className }: IconProps) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      {children}
    </svg>
  );

const Search = makeIcon(
  <>
    <circle cx="11" cy="11" r="7" {...iconStroke} />
    <path d="m16.5 16.5 4 4" {...iconStroke} />
  </>
);
const Plus = makeIcon(<path d="M12 5v14M5 12h14" {...iconStroke} />);
const Bell = makeIcon(
  <>
    <path d="M6 9a6 6 0 1 1 12 0c0 7 3 6 3 8H3c0-2 3-1 3-8" {...iconStroke} />
    <path d="M10 21h4" {...iconStroke} />
  </>
);
const FileText = makeIcon(
  <>
    <path d="M6 3h8l4 4v14H6z" {...iconStroke} />
    <path d="M14 3v5h5M9 13h6M9 17h4" {...iconStroke} />
  </>
);
const Square = makeIcon(<rect x="5" y="5" width="14" height="14" rx="2" {...iconStroke} />);
const Bot = makeIcon(
  <>
    <rect x="5" y="8" width="14" height="11" rx="4" {...iconStroke} />
    <path d="M12 4v4M9 13h.01M15 13h.01M10 17h4" {...iconStroke} />
  </>
);
const BookOpen = makeIcon(
  <>
    <path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H20v17H7.5A3.5 3.5 0 0 0 4 22z" {...iconStroke} />
    <path d="M4 5.5V22M12 2v17" {...iconStroke} />
  </>
);
const MessageCircle = makeIcon(
  <>
    <path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20l1.1-5.2A8.5 8.5 0 1 1 21 11.5Z" {...iconStroke} />
  </>
);
const Clock3 = makeIcon(
  <>
    <circle cx="12" cy="12" r="9" {...iconStroke} />
    <path d="M12 7v5l3 2" {...iconStroke} />
  </>
);
const Menu = makeIcon(<path d="M4 7h16M4 12h16M4 17h16" {...iconStroke} />);
const X = makeIcon(<path d="M6 6l12 12M18 6 6 18" {...iconStroke} />);
const ChevronDown = makeIcon(<path d="m6 9 6 6 6-6" {...iconStroke} />);
const ChevronLeft = makeIcon(<path d="m15 18-6-6 6-6" {...iconStroke} />);
const ChevronRight = makeIcon(<path d="m9 18 6-6-6-6" {...iconStroke} />);
const Send = makeIcon(
  <>
    <path d="M22 2 11 13" {...iconStroke} />
    <path d="m22 2-7 20-4-9-9-4z" {...iconStroke} />
  </>
);
const Copy = makeIcon(
  <>
    <rect x="8" y="8" width="12" height="12" rx="2" {...iconStroke} />
    <path d="M4 16V6a2 2 0 0 1 2-2h10" {...iconStroke} />
  </>
);
const Download = makeIcon(<path d="M12 3v12m0 0 5-5m-5 5-5-5M5 21h14" {...iconStroke} />);
const Globe2 = makeIcon(
  <>
    <circle cx="12" cy="12" r="9" {...iconStroke} />
    <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" {...iconStroke} />
  </>
);
const Filter = makeIcon(<path d="M4 5h16M7 12h10M10 19h4" {...iconStroke} />);
const RotateCw = makeIcon(<path d="M21 12a9 9 0 1 1-3-6.7M21 3v6h-6" {...iconStroke} />);
const Edit3 = makeIcon(<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" {...iconStroke} />);
const Circle = makeIcon(<circle cx="12" cy="12" r="8" {...iconStroke} />);
const Trash2 = makeIcon(<path d="M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3" {...iconStroke} />);
const MoreHorizontal = makeIcon(<path d="M6 12h.01M12 12h.01M18 12h.01" {...iconStroke} />);
const Upload = makeIcon(<path d="M12 16V4m0 0-5 5m5-5 5 5M4 20h16" {...iconStroke} />);

type View = 'home' | 'chat' | 'history' | 'tasks' | 'knowledge' | 'kbDetail' | 'admin';
type Agent = 'secretary' | 'badchild';
type Modal =
  | null
  | 'kbPicker'
  | 'taskConfig'
  | 'frequencyMenu'
  | 'fileStatusMenu'
  | 'createKb'
  | 'upload'
  | 'report'
  | 'template'
  | 'mobileTools'
  | 'mobileScenes';

const conversations = [
  { title: '冬眠的熊是一次性大量进食...', date: '2026年12月25日', summary: '比如生活在热带、亚热带地区的马来熊，它们的栖息地全年温暖，食物也相对稳定。' },
  { title: '华熙在HA领域的最新研究成果', date: '2026年12月25日', summary: '围绕透明质酸原料、医美护理与再生医学相关资料进行知识检索。' },
  { title: '生物护理品原料四大业务领域', date: '2026年12月24日', summary: '梳理生物活性物、合成生物、功能糖及细胞工程等业务资料。' },
  { title: '抗衰老技术领域月度情报', date: '2026年12月23日', summary: '追踪法规、论文、专利和竞品动态，生成阶段性情报摘要。' },
  { title: 'AI创新探索分析', date: '2026年12月22日', summary: '从开放问题出发连接不同领域知识，形成技术路径与概念启发。' },
  { title: '华熙当康品牌宣传资料', date: '2026年12月21日', summary: '检索品牌资料、产品卖点和公开传播素材。' }
];
type Conversation = (typeof conversations)[number];

const taskRows = [
  { title: '抗衰老技术领域月度情报', badge: '有新报告', status: '运行中', color: 'green' },
  { title: '定时任务222222', status: '异常（1次任务执行失败）', color: 'orange' },
  { title: '定时任务333333', status: '运行中', color: 'green' }
];

const kbCards = Array.from({ length: 6 }, (_, index) => ({
  title: '知识库1',
  owner: 'wangdazhuang',
  files: 16,
  desc: '一段介绍一段介绍一段介绍一段介绍一段介绍一段介绍一段介绍一段介绍一段介绍一段介绍一段介绍一段介绍...'
}));

const fileRows = [
  { name: '蛋白设计方案.docx', status: '未处理', progress: 0, tone: 'gray' },
  { name: '蛋白设计方案.pdf', status: '处理中', progress: 50, tone: 'blue' },
  { name: '蛋白设计方案.pdf', status: '处理完成', progress: 100, tone: 'blue' },
  { name: '蛋白设计方案.pdf', status: '处理失败', progress: 60, tone: 'orange' }
];

const quotaRows = [
  { title: '小秘书-联网模式', total: '1,000,000次/年', used: '467800' },
  { title: '小秘书-非联网模式', total: '25,000次/年', used: '7800' },
  { title: '坏孩子', total: '12,000次/年', used: '4678' }
];

function App() {
  const [view, setView] = useState<View>('home');
  const [agent, setAgent] = useState<Agent>('secretary');
  const [modal, setModal] = useState<Modal>(null);
  const [citationOpen, setCitationOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [historySearch, setHistorySearch] = useState('');
  const filteredConversations = useMemo(
    () =>
      conversations.filter((item) => {
        const keyword = historySearch.toLowerCase();
        return item.title.toLowerCase().includes(keyword) || item.summary.toLowerCase().includes(keyword);
      }),
    [historySearch]
  );

  useEffect(() => {
    if (!modal) return undefined;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setModal(null);
    };

    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [modal]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
    document.querySelector('.workspace')?.scrollTo({ top: 0, left: 0 });
    document.querySelector('.workspace > section')?.scrollTo({ top: 0, left: 0 });
  }, [view]);

  const openView = (next: View) => {
    setView(next);
    setMobileMenuOpen(false);
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0 });
      document.querySelector('.workspace')?.scrollTo({ top: 0, left: 0 });
      document.querySelector('.workspace > section')?.scrollTo({ top: 0, left: 0 });
    });
  };

  const startChat = () => {
    setCitationOpen(false);
    openView('chat');
  };

  return (
    <div className={`prototype-shell ${citationOpen && view === 'chat' ? 'with-citation' : ''}`}>
      <WindowChrome />
      <FeishuRail />
      <AppSidebar
        view={view}
        conversations={filteredConversations}
        openView={openView}
        mobileMenuOpen={mobileMenuOpen}
        closeMobileMenu={() => setMobileMenuOpen(false)}
      />
      <main className={`workspace view-${view} ${citationOpen && view === 'chat' ? 'has-citation' : ''}`}>
        <div className="mobile-topbar">
          <button className="mobile-menu" aria-label="打开菜单" onClick={() => setMobileMenuOpen(true)}>
            <Menu size={22} />
          </button>
          <div className="mobile-brand">
            <RobotFace small agent={agent} />
            <strong>{view === 'chat' ? '会话名称名称' : '华熙AI知识助手'}</strong>
          </div>
          <button className="mobile-new" aria-label="配置能力" onClick={() => setModal('mobileTools')}>
            <Plus size={22} />
          </button>
        </div>
        {view === 'home' && <HomeView agent={agent} setAgent={setAgent} setModal={setModal} startChat={startChat} />}
        {view === 'chat' && <ChatView agent={agent} setAgent={setAgent} setModal={setModal} setCitationOpen={setCitationOpen} />}
        {view === 'history' && <HistoryView search={historySearch} setSearch={setHistorySearch} />}
        {view === 'tasks' && <TasksView setModal={setModal} />}
        {view === 'knowledge' && <KnowledgeView setView={setView} setModal={setModal} />}
        {view === 'kbDetail' && <KnowledgeDetail setView={setView} setModal={setModal} />}
        {view === 'admin' && <AdminView setModal={setModal} openView={openView} />}
      </main>
      {citationOpen && view === 'chat' && <CitationDrawer onClose={() => setCitationOpen(false)} />}
      {modal && <ModalLayer type={modal} close={() => setModal(null)} setModal={setModal} />}
    </div>
  );
}

function WindowChrome() {
  return (
    <div className="window-chrome" aria-hidden="true">
      <div className="mac-dots">
        <i />
        <i />
        <i />
      </div>
      <div className="chrome-nav">
        <ChevronLeft size={24} />
        <ChevronRight size={24} />
        <RotateCw size={21} />
      </div>
      <div className="chrome-actions">
        <MessageCircle size={18} />
        <Circle size={18} />
        <Square size={18} />
        <MoreHorizontal size={21} />
        <X size={24} />
      </div>
    </div>
  );
}

function FeishuRail() {
  const rail = [
    { label: '搜索', icon: <Search size={23} /> },
    { label: '新建', icon: <Plus size={24} /> },
    { label: '消息', icon: <Bell size={21} /> },
    { label: '云文档', icon: <FileText size={20} /> },
    { label: '多维表格', icon: <Square size={20} /> },
    { label: '工作台', icon: <GridMark /> },
    { label: '通讯录', icon: <Bot size={20} /> },
    { label: '更多', icon: <BookOpen size={19} /> },
    { label: '不重要', icon: <Circle size={18} /> }
  ];

  return (
    <aside className="feishu-rail" aria-label="飞书导航">
      <div className="user-avatar" />
      {rail.map((item) => (
        <button key={item.label} className={`feishu-item ${item.label === '工作台' ? 'active' : ''}`} aria-label={item.label}>
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </aside>
  );
}

function AppSidebar({
  view,
  conversations,
  openView,
  mobileMenuOpen,
  closeMobileMenu
}: {
  view: View;
  conversations: Conversation[];
  openView: (view: View) => void;
  mobileMenuOpen: boolean;
  closeMobileMenu: () => void;
}) {
  const adminMode = view === 'admin';

  return (
    <aside className={`app-sidebar ${mobileMenuOpen ? 'open' : ''} ${adminMode ? 'admin-sidebar' : ''}`}>
      <div className="app-title">
        <AppRobotLogo />
        <strong>{adminMode ? '华熙AI知识助手管理端' : '华熙AI知识助手'}</strong>
        <button aria-label="关闭移动菜单" className="sidebar-close" onClick={closeMobileMenu}>
          <X size={18} />
        </button>
        <Menu size={20} className="desktop-collapse" />
      </div>
      <nav className="side-nav" aria-label="AI助手导航">
        {adminMode ? (
          <>
            <button className="admin-return" onClick={() => openView('home')}>
              <ChevronLeft size={16} />
              返回用户端
            </button>
            <button className="active" onClick={() => openView('admin')}>
              <MessageCircle size={16} />
              数据监控
            </button>
            <button onClick={() => openView('admin')}>
              <MessageCircle size={16} />
              模板配置
            </button>
          </>
        ) : (
          <>
            <button className={view === 'home' ? 'active' : ''} onClick={() => openView('home')}>
              <MessageCircle size={16} />
              新建会话
            </button>
            <button className={view === 'tasks' ? 'active' : ''} onClick={() => openView('tasks')}>
              <Clock3 size={17} />
              定时任务
            </button>
            <button className={view === 'knowledge' || view === 'kbDetail' ? 'active' : ''} onClick={() => openView('knowledge')}>
              <BookOpen size={16} />
              知识库
            </button>
            <button className={view === 'history' ? 'active' : ''} onClick={() => openView('history')}>
              <Clock3 size={16} />
              历史会话
            </button>
          </>
        )}
      </nav>
      {!adminMode && (
        <>
          <div className="side-history">
            {conversations.map((item, index) => (
              <button key={`${item.title}-${index}`} className={index === 0 ? 'current' : ''} onClick={() => openView('chat')}>
                <span className="conversation-date">{item.date}</span>
                <strong>{item.title}</strong>
                <small>{item.summary}</small>
                <span className="conversation-actions" aria-hidden="true">
                  <Edit3 size={16} />
                  <Circle size={16} />
                  <Trash2 size={16} />
                </span>
              </button>
            ))}
          </div>
          <button className="all-history" onClick={() => openView('history')}>
            全部会话 <span>&gt;&gt;</span>
          </button>
          <div className="agent-shortcuts">
            <button onClick={() => openView('admin')}>管理端</button>
          </div>
        </>
      )}
    </aside>
  );
}

function HomeView({
  agent,
  setAgent,
  setModal,
  startChat
}: {
  agent: Agent;
  setAgent: (agent: Agent) => void;
  setModal: (modal: Modal) => void;
  startChat: () => void;
}) {
  return (
    <section className="home-stage">
      <div className="home-avatar-anchor">
        <RobotFace agent={agent} />
      </div>
      <AgentSwitch agent={agent} setAgent={setAgent} />
      <p className="assistant-line">
        {agent === 'secretary'
          ? '你好,我是华熙小秘书,我严格控制输出内容，基于已知事实作答'
          : '我是华熙坏孩子，我能够对开放性问题进行创新探索'}
      </p>
      <PromptBox agent={agent} setAgent={setAgent} setModal={setModal} onSend={startChat} />
      <SuggestionList agent={agent} onSelect={startChat} />
    </section>
  );
}

function PromptBox({
  agent,
  setAgent,
  setModal,
  onSend,
  compact
}: {
  agent: Agent;
  setAgent: (agent: Agent) => void;
  setModal: (modal: Modal) => void;
  onSend?: () => void;
  compact?: boolean;
}) {
  return (
    <div className={`prompt-box agent-${agent} ${compact ? 'compact' : ''}`}>
      <div className="prompt-line">
        <AgentPill agent={agent} setAgent={setAgent} />
        <span className="placeholder">
          {agent === 'secretary'
            ? '输入您的问题，小秘书将为您找到最相关的答案'
            : '输入一个开放性问题，AI将连接不同领域的知识图谱,生成技术综述并启发创新方向。'}
        </span>
      </div>
      <div className="prompt-tools">
        {agent === 'secretary' ? (
          <>
            <button className="icon-chip">
              <LinkGlyph />
            </button>
            <button className="tool-chip">
              <Bot size={15} />
              智能搜索
            </button>
            <button className="tool-chip kb-tool" onClick={() => setModal('kbPicker')}>
              <Bot size={15} />
              知识库(3)
            </button>
            <button className="tool-chip">
              技术综述
              <ChevronDown size={14} />
            </button>
          </>
        ) : (
          <>
            <button className="tool-chip kb-tool" onClick={() => setModal('kbPicker')}>
              <Bot size={15} />
              知识库(3)
            </button>
            <button className="tool-chip">
              科学洞察
              <ChevronDown size={14} />
            </button>
            <button className="tool-chip">
              风格设定
              <ChevronDown size={14} />
            </button>
          </>
        )}
        <button className="send-circle" aria-label="发送" onClick={onSend}>
          <Send size={24} />
        </button>
      </div>
    </div>
  );
}

function AgentPill({ agent, setAgent }: { agent: Agent; setAgent: (agent: Agent) => void }) {
  return (
    <button className="agent-pill" onClick={() => setAgent(agent === 'secretary' ? 'badchild' : 'secretary')}>
      <RobotFace micro agent={agent} />
      {agent === 'secretary' ? '小秘书' : '坏孩子'}
      <RotateCw size={14} className="swap" />
    </button>
  );
}

function AgentSwitch({ agent, setAgent }: { agent: Agent; setAgent: (agent: Agent) => void }) {
  const agents: Array<{ key: Agent; label: string }> = [
    { key: 'secretary', label: '小秘书' },
    { key: 'badchild', label: '坏孩子' }
  ];

  return (
    <div className="home-agent-switcher" role="group" aria-label="切换智能体">
      {agents.map((item) => (
        <button key={item.key} className={agent === item.key ? 'active' : ''} aria-pressed={agent === item.key} onClick={() => setAgent(item.key)}>
          <RobotFace small agent={item.key} />
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}

function SuggestionList({ agent, onSelect }: { agent: Agent; onSelect: () => void }) {
  if (agent === 'badchild') {
    return (
      <div className="suggestion-area badchild">
        <span>试试这些示例:</span>
        <div className="report-suggestions">
          {[1, 2, 3].map((item) => (
            <button key={item} className="report-suggestion" onClick={onSelect}>
              <ReportIcon />
              XXX创新探索分析
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="suggestion-area">
      <span>试试这些示例:</span>
      <button onClick={onSelect}>华熙在HA领域的最新研究成果</button>
      <button onClick={onSelect}>生物护理品原料包含的四大业务领域讲解</button>
      <button onClick={onSelect}>华熙当康、生物科技品牌宣传资料</button>
    </div>
  );
}

function ChatView({
  agent,
  setAgent,
  setModal,
  setCitationOpen
}: {
  agent: Agent;
  setAgent: (agent: Agent) => void;
  setModal: (modal: Modal) => void;
  setCitationOpen: (open: boolean) => void;
}) {
  return (
    <section className="chat-stage">
      <div className="breadcrumb">
        麦角硫因稳定性相关数据数据分析 <ChevronRight size={18} />
      </div>
      {agent === 'secretary' ? <SecretaryAnswer setCitationOpen={setCitationOpen} /> : <BadChildAnswer setModal={setModal} />}
      <div className="fixed-composer">
        <PromptBox agent={agent} setAgent={setAgent} setModal={setModal} compact />
      </div>
    </section>
  );
}

function SecretaryAnswer({ setCitationOpen }: { setCitationOpen: (open: boolean) => void }) {
  return (
    <div className="answer-flow">
      <div className="user-bubble">帮我找出麦角硫因稳定性相关数据</div>
      <div className="assistant-row">
        <RobotFace micro agent="secretary" />
        <div className="answer-main">
          <p className="answer-ask">我来帮您搜索麦角硫因（Ergothioneine）稳定性相关的研究数据。</p>
          <button className="search-strip" onClick={() => setCitationOpen(true)}>
            <Search size={22} />
            <span className="search-label">搜索知识库</span>
            <span className="search-separator">|</span>
            <span className="search-file">知识库文件名.pdf</span>
            <strong>36个结果 &gt;</strong>
          </button>
          <p>根据知识库搜索结果，我为您整理了麦角硫因（Ergothioneine, EGT）的稳定性相关数据。以下是详细的技术数据汇总：</p>
          <div className="data-card">
            <h2>一、热稳定性数据</h2>
            <div className="table-box">
              <div className="table-title">
                表格
                <span>
                  <Copy size={18} />
                  <Download size={18} />
                </span>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>温度条件</th>
                    <th>稳定性表现</th>
                    <th>半衰期/降解特性</th>
                    <th>来源</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['100°C', '符合一级反应动力学模型', '半衰期约 30分钟', 'Bing'],
                    ['40°C', '降解速率显著减慢', '半衰期延长至 数小时', 'Bing'],
                    ['275-276°C', '无水形式开始分解', '分解温度阈值', 'PDF | bench...'],
                    ['长时间高温油炸', '含量有所降低', '化学键断裂导致结构改变', '2000A室内...'],
                    ['烹饪处理', '煮沸导致显著损失，油炸损失较少', '加工方法影响保留率', 'PDF | bench...']
                  ].map((row) => (
                    <tr key={row[0]}>
                      {row.map((cell, index) => (
                        <td key={cell}>{index === 3 ? <span className="source-badge">{cell}</span> : cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <h2>二、关键稳定性机制</h2>
            <p>麦角硫因的卓越稳定性主要源于其独特的互变异构现象。</p>
            <ul>
              <li>在生理 pH 下主要以硫酮（thione）形式存在。</li>
              <li>硫酮形式比硫醇（thiol）形式具有更高的热稳定性和化学稳定性。</li>
              <li>
                该结构使其不易自动氧化，且不会促进金属离子催化的自由基生成。
                <span className="inline-citation" onClick={() => setCitationOpen(true)}>
                  PDF | 文件...
                  <span className="citation-popover">
                    <Globe2 size={17} />
                    <strong>文章标题.pdf</strong>
                    <small>知识库名称 ｜ 文章创建人 2025-07-16 12:13:11</small>
                  </span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function BadChildAnswer({ setModal }: { setModal: (modal: Modal) => void }) {
  return (
    <div className="answer-flow badchild-answer">
      <div className="path-card">
        <strong>研究完成</strong>
        <span>我已完成了关于麦角硫因稳定性相关的科研探索。</span>
      </div>
      <h2>通过系统性的研究，我为您整理了一份详尽的报告。</h2>
      <p>报告涵盖了冲突的历史背景、最新动态、各方立场、影响评估以及未来展望。</p>
      <p>报告详细分析了从古代波斯帝国与犹太人的友好关系到现代冲突的演变过程。</p>
      <p>最后，报告对冲突的影响进行了多维度评估，并提供了未来展望和政策建议。</p>
      <h3>完整版报告在这里</h3>
      <div className="report-file" onClick={() => setModal('report')}>
        <ReportIcon />
        <span>AI创新洞察报告:再生医...衰护肤</span>
        <button onClick={(event) => event.stopPropagation()}>
          <MoreHorizontal size={17} />
        </button>
        <div className="download-menu">
          <button>导出为markdown</button>
          <button>导出为PDF</button>
          <button>导出为word</button>
        </div>
      </div>
    </div>
  );
}

function HistoryView({ search, setSearch }: { search: string; setSearch: (search: string) => void }) {
  return (
    <section className="panel-page history-page">
      <h1>历史会话</h1>
      <div className="wide-search">
        <Search size={21} />
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="搜索历史会话" />
        {search && <X size={18} />}
      </div>
      <TimelineGroup label="今天" />
      <TimelineGroup label="本周" repeat />
    </section>
  );
}

function TimelineGroup({ label, repeat }: { label: string; repeat?: boolean }) {
  const rows = repeat ? ['标题标题', '标题标题'] : ['标题标题'];
  return (
    <div className="timeline-group">
      <span>{label}</span>
      {rows.map((row, index) => (
        <article className="history-row" key={`${label}-${index}`}>
          <div>
            <strong>{row}</strong>
            <p>正文</p>
          </div>
          <footer>
            <small>小秘书 ｜ 知识检索 ｜ 2026-03-24 14:37</small>
            <span>
              <button aria-label="继续对话">
                <MessageCircle size={17} />
              </button>
              <button aria-label="删除会话">
                <Trash2 size={17} />
              </button>
            </span>
          </footer>
        </article>
      ))}
    </div>
  );
}

function TasksView({ setModal }: { setModal: (modal: Modal) => void }) {
  return (
    <section className="task-page">
      <div className="task-hero">
        <TaskBotMascot />
        <p>选择关注领域、时间范围并创建定时任务，AI将自动汇总最新的技术、法规和竞品动态。</p>
        <div className="task-create-bar">
          <input placeholder="在此描述您的关注领域或关注要点" />
          <button className="select-button frequency-trigger" onClick={() => setModal('frequencyMenu')} aria-haspopup="menu">
            每天 <ChevronDown size={16} />
          </button>
          <button className="config-button" onClick={() => setModal('taskConfig')} aria-label="更多配置">
            <Filter size={21} />
          </button>
          <button className="primary-action">发布任务</button>
        </div>
      </div>
      <div className="task-list">
        {taskRows.map((task) => (
          <article key={task.title} className="task-card">
            {task.badge && <span className="new-report">{task.badge}</span>}
            <ReportIcon />
            <div>
              <h2>
                {task.title}
                <span className={`dot ${task.color}`} />
                <em>{task.status}</em>
              </h2>
              <p>任务介绍任务介绍任务介绍</p>
              <footer>频次：每周一 14:37 ｜ 已执行轮次：12 ｜ 最新执行时间：2026-3-24 ｜ 下次执行时间：2026-3-24</footer>
            </div>
            <div className="hover-actions">
              <button className="tooltip">测试</button>
              <button>
                <RotateCw size={19} />
              </button>
              <button>
                <Edit3 size={19} />
              </button>
              <button>
                <Circle size={19} />
              </button>
              <button>
                <Trash2 size={19} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function TaskBotMascot() {
  return (
    <span className="task-bot-mascot" aria-hidden="true">
      <i />
      <i />
      <b />
    </span>
  );
}

function AppRobotLogo() {
  return (
    <span className="app-robot-logo" aria-hidden="true">
      <i />
      <i />
      <b />
    </span>
  );
}

function KnowledgeView({ setView, setModal }: { setView: (view: View) => void; setModal: (modal: Modal) => void }) {
  return (
    <section className="knowledge-page">
      <div className="knowledge-toolbar">
        <button className="muted-primary" onClick={() => setModal('createKb')}>
          创建知识库
        </button>
        <span />
        <button className="sort-select">
          按创建时间排序 <ChevronDown size={16} />
        </button>
        <div className="table-search">
          <Search size={20} />
          <input placeholder="输入知识库名称或关键词以查询" />
        </div>
      </div>
      <div className="kb-grid-real">
        {kbCards.map((card, index) => (
          <article key={`${card.title}-${index}`} className="kb-card-real" onClick={() => setView('kbDetail')}>
            <h2>{card.title}</h2>
            <p>{card.desc}</p>
            <footer>
              {card.owner} ｜ 1天前 ｜ 文件数:{card.files}
              <span>
                <Edit3 size={18} />
                <Trash2 size={18} />
              </span>
            </footer>
          </article>
        ))}
      </div>
      <Pagination />
    </section>
  );
}

function KnowledgeDetail({ setView, setModal }: { setView: (view: View) => void; setModal: (modal: Modal) => void }) {
  return (
    <section className="kb-detail-page">
      <div className="detail-title">
        <button onClick={() => setView('knowledge')}>
          <ChevronLeft size={24} />
        </button>
        <h1>知识库名称</h1>
      </div>
      <div className="file-toolbar">
        <button className="muted-primary" onClick={() => setModal('upload')}>
          上传文件
        </button>
        <button className="sort-select file-status-trigger" onClick={() => setModal('fileStatusMenu')} aria-haspopup="menu">
          全部 <ChevronDown size={16} />
        </button>
        <div className="table-search">
          <Search size={18} />
          <input placeholder="输入文件名称或关键词以查询" />
        </div>
      </div>
      <table className="file-table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" /> 文件名称
            </th>
            <th>状态</th>
            <th />
            <th>文件来源</th>
            <th>创建时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {fileRows.map((file) => (
            <tr key={`${file.name}-${file.status}`}>
              <td>
                <input type="checkbox" /> {file.name}
              </td>
              <td>{file.status}</td>
              <td>
                <div className="mini-progress">
                  <i className={file.tone} style={{ width: `${file.progress}%` }} />
                </div>
                {file.progress}%
              </td>
              <td>本地上传</td>
              <td>2024/11/1 14:30:26</td>
              <td>
                下载 <button className="delete-link">删除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination />
    </section>
  );
}

function AdminView({ setModal, openView }: { setModal: (modal: Modal) => void; openView: (view: View) => void }) {
  return (
    <section className="admin-page">
      <div className="admin-page-head">
        <h1>调用额度</h1>
        <button onClick={() => openView('home')}>
          <ChevronLeft size={16} />
          返回用户端
        </button>
      </div>
      <div className="quota-grid-real">
        {quotaRows.map((item) => (
          <article className="quota-card-real" key={item.title}>
            <h2>{item.title}</h2>
            <div className="quota-body">
              <div>
                <p>
                  已使用: <strong>78%</strong>
                </p>
                <hr />
                <span>总次数&nbsp;&nbsp; {item.total}</span>
                <span>已使用&nbsp;&nbsp; {item.used}</span>
              </div>
              <div className="donut" />
            </div>
          </article>
        ))}
      </div>
      <div className="template-list">
        <div className="template-head">
          <h1>模板配置</h1>
          <button className="muted-primary" onClick={() => setModal('template')}>
            新建模板
          </button>
        </div>
        {[1, 2].map((item) => (
          <article className="template-item" key={item}>
            <h2>模板111111</h2>
            <p>提示词提示词提示词提示词提示词提示词提示词提示词提示词...</p>
            <footer>
              admin ｜ 1天前 ｜ 编码
              <span>
                <Edit3 size={18} />
                <Trash2 size={18} />
              </span>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}

function CitationDrawer({ onClose }: { onClose: () => void }) {
  return (
    <aside className="citation-drawer">
      <div className="drawer-title">
        <h2>引用</h2>
        <button onClick={onClose}>
          <X size={28} />
        </button>
      </div>
      {[1, 2].map((item) => (
        <button className="citation-row" key={item}>
          <Globe2 size={22} />
          <strong>文章标题.pdf</strong>
          <small>知识库名称 ｜ 文章创建人&nbsp;&nbsp;2025-07-16&nbsp;&nbsp;12:13:11</small>
        </button>
      ))}
    </aside>
  );
}

function ModalLayer({ type, close, setModal }: { type: Modal; close: () => void; setModal: (modal: Modal) => void }) {
  return (
    <div
      className={`modal-mask ${type === 'mobileTools' || type === 'mobileScenes' ? 'mobile-sheet-mask' : ''} ${type === 'kbPicker' ? 'kb-picker-mask' : ''} ${type === 'frequencyMenu' ? 'frequency-menu-mask' : ''} ${type === 'fileStatusMenu' ? 'file-status-menu-mask' : ''}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      {type === 'kbPicker' && <KbPicker close={close} />}
      {type === 'taskConfig' && <TaskConfig close={close} />}
      {type === 'frequencyMenu' && <FrequencyMenu close={close} />}
      {type === 'fileStatusMenu' && <FileStatusMenu close={close} />}
      {type === 'createKb' && <CreateKb close={close} />}
      {type === 'upload' && <UploadModal close={close} />}
      {type === 'report' && <ReportModal close={close} />}
      {type === 'template' && <TemplateModal close={close} />}
      {type === 'mobileTools' && <MobileToolsSheet close={close} setModal={setModal} />}
      {type === 'mobileScenes' && <MobileScenesSheet close={close} />}
    </div>
  );
}

function MobileToolsSheet({ close, setModal }: { close: () => void; setModal: (modal: Modal) => void }) {
  return (
    <section className="mobile-sheet tools-sheet">
      <div className="sheet-handle" />
      <button className="sheet-row" onClick={close}>
        <Bot size={28} />
        <strong>联网搜索</strong>
        <span>打开 &gt;</span>
      </button>
      <button className="sheet-row" onClick={() => setModal('mobileScenes')}>
        <Bot size={28} />
        <strong>知识库</strong>
        <span>启用 &gt;</span>
      </button>
    </section>
  );
}

function MobileScenesSheet({ close }: { close: () => void }) {
  const scenes = [
    { title: '技术综述', tone: 'yellow' },
    { title: '方向传播', tone: 'green' },
    { title: '科学洞察', tone: 'pink' }
  ];

  return (
    <section className="mobile-sheet scenes-sheet">
      <div className="sheet-handle" />
      <button className="sheet-row scene-head" onClick={close}>
        <Bot size={28} />
        <strong>知识库</strong>
        <span>启用 &gt;</span>
      </button>
      <div className="scene-list">
        <span>场景选择</span>
        {scenes.map((scene) => (
          <button key={scene.title} className="scene-mobile-row" onClick={close}>
            <i className={scene.tone}>
              <Bot size={26} />
            </i>
            <strong>{scene.title}</strong>
            <small>全面系统梳理技术领域发展脉络与核心要点。</small>
          </button>
        ))}
      </div>
    </section>
  );
}

function FrequencyMenu({ close }: { close: () => void }) {
  return (
    <section className="frequency-menu" role="menu" aria-label="选择定时任务频次">
      <button className="selected" role="menuitem" onClick={close}>
        <span>✓</span>
        每天
      </button>
      <button role="menuitem" onClick={close}>
        <span />
        每周
      </button>
    </section>
  );
}

function FileStatusMenu({ close }: { close: () => void }) {
  const options = ['全部', '未处理', '处理中', '处理失败', '处理完成'];

  return (
    <section className="file-status-menu" role="menu" aria-label="选择文件处理状态">
      {options.map((option, index) => (
        <button key={option} className={index === 1 ? 'hovered' : index === 0 ? 'selected' : ''} role="menuitem" onClick={close}>
          <span>{index === 0 ? '✓' : ''}</span>
          {option}
        </button>
      ))}
    </section>
  );
}

function KbPicker({ close }: { close: () => void }) {
  return (
    <section className="modal-panel kb-picker-modal" aria-label="选择知识库">
      <ModalClose close={close} />
      <div className="kb-picker-head">
        <h2>知识库</h2>
        <button className="kb-enable" onClick={close}>
          启用
          <ChevronRight size={14} />
        </button>
      </div>
      <div className="kb-picker-subhead">选择知识库</div>
      <div className="kb-selected-row">
        <button>
          知识库1
          <X size={14} />
        </button>
        <button>
          研发资料库
          <X size={14} />
        </button>
      </div>
      <div className="inner-search">
        <Search size={17} />
        <input placeholder="搜索知识库名称" />
      </div>
      <div className="kb-option-list">
        {['知识库1', '华熙原料资料库', '法规与竞品情报'].map((item, index) => (
          <button key={item} className={index < 2 ? 'selected' : ''}>
            <span>
              <BookOpen size={16} />
              {item}
            </span>
            <i>{index < 2 ? '✓' : '+'}</i>
          </button>
        ))}
      </div>
      <small className="kb-picker-tip">最多选择 3 个知识库，选择后会随提问一起参与检索。</small>
      <ModalFooter close={close} confirm="确定" />
    </section>
  );
}

function TaskConfig({ close }: { close: () => void }) {
  return (
    <section className="modal-panel task-modal">
      <ModalClose close={close} />
      <h2>输入任务名称</h2>
      <div className="task-modal-row">
        <RotateCw size={22} />
        <button className="field-select">
          每天 <ChevronDown size={17} />
        </button>
        <button className="field-select">
          0时 <ChevronDown size={17} />
        </button>
      </div>
      <p>* 发布频次中设定的时间为任务执行时间，任务执行后需等待几分钟查看结果</p>
      <textarea placeholder="在此描述您的关注领域或关注要点" />
      <ModalFooter close={close} confirm="完成" />
    </section>
  );
}

function CreateKb({ close }: { close: () => void }) {
  return (
    <section className="modal-panel form-modal">
      <ModalClose close={close} />
      <h2>创建知识库</h2>
      <label>
        <span>* 知识库名称</span>
        <input placeholder="请输入知识库名称,不超过20字符" />
      </label>
      <label>
        <span>描述</span>
        <textarea placeholder="请输入知识库描述信息，不超过200字符" />
      </label>
      <ModalFooter close={close} confirm="创建" muted />
    </section>
  );
}

function UploadModal({ close }: { close: () => void }) {
  return (
    <section className="modal-panel upload-modal">
      <ModalClose close={close} />
      <h2>上传文件</h2>
      <label className="radio-line">
        <input type="radio" defaultChecked /> 本地上传
      </label>
      <div className="drop-zone">
        <Upload size={38} />
        <p>点击上传或拖拽本地文件至此处</p>
        <small>支持Markdown、DOC、DOCX、WPS、TXT、PDF、ZIP、XLS、XLSX格式文件</small>
      </div>
      <div className="upload-file">xxxxxx（文件名）.zip</div>
      <label className="toggle-line">
        <input type="checkbox" defaultChecked /> 多模态解析
      </label>
      <ModalFooter close={close} confirm="上传" muted />
    </section>
  );
}

function ReportModal({ close }: { close: () => void }) {
  return (
    <section className="modal-panel report-modal">
      <ModalClose close={close} />
      <h2>查看报告</h2>
      <h1>AI创新洞察报告:再生医学赋能抗衰护肤</h1>
      <h3>技术路径综述</h3>
      <p>麦角硫因的卓越稳定性主要源于其独特的互变异构现象：</p>
      <ul>
        <li>在生理pH下主要以硫酮形式存在（约95%以上）</li>
        <li>硫酮形式比硫醇形式具有更高的热稳定性和化学稳定性</li>
      </ul>
      <h3>产品创新概念</h3>
      <div className="concept-card">
        <strong>概念1：细胞信使——冻干安瓶</strong>
        <span>技术融合：路径1+2。高纯度植物外泌体+NMN冻干粉,即时活化。</span>
        <span>目标客群：30+有密集修复需求的精致女性。</span>
      </div>
      <div className="concept-card">
        <strong>概念1：细胞信使——冻干安瓶</strong>
        <span>营销故事：“唤醒沉睡肌底,7天重焕新生光彩”。</span>
      </div>
    </section>
  );
}

function TemplateModal({ close }: { close: () => void }) {
  return (
    <section className="modal-panel template-modal">
      <ModalClose close={close} />
      <h2>新建风格模板</h2>
      <label>
        <span>* 模板名称</span>
        <input placeholder="请输入风格模板名称，建议简明扼要" />
      </label>
      <label className="scene-row">
        <span>场景选择</span>
        <button className="scene-choice">✓ 科学洞察</button>
      </label>
      <label>
        <span>* 用户提示词</span>
        <textarea placeholder="请输入用户提示词" />
      </label>
      <ModalFooter close={close} confirm="创建" muted />
    </section>
  );
}

function ModalClose({ close }: { close: () => void }) {
  return (
    <button className="modal-close" aria-label="关闭" onClick={close}>
      <X size={32} />
    </button>
  );
}

function ModalFooter({ close, confirm, muted }: { close: () => void; confirm: string; muted?: boolean }) {
  return (
    <footer className="modal-footer">
      <button onClick={close}>取消</button>
      <button className={muted ? 'muted-confirm' : 'confirm'}>{confirm}</button>
    </footer>
  );
}

function RobotFace({ small, micro, agent = 'secretary' }: { small?: boolean; micro?: boolean; agent?: Agent }) {
  const src = agent === 'secretary' ? secretaryAvatarUrl : badchildAvatarUrl;

  return (
    <img className={`robot-face agent-avatar-${agent} ${small ? 'small' : ''} ${micro ? 'micro' : ''}`} src={src} alt="" aria-hidden="true" />
  );
}

function ReportIcon() {
  return (
    <span className="report-icon" aria-hidden="true">
      <FileText size={24} />
    </span>
  );
}

function GridMark() {
  return (
    <span className="grid-mark" aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}

function LinkGlyph() {
  return <span className="link-glyph" aria-hidden="true" />;
}

function Pagination() {
  return (
    <div className="pagination-real">
      总共 85 个项目 <ChevronLeft size={21} /> <b>1</b> <span>2</span> <span>3</span> <span>4</span> <span>5</span> <ChevronRight size={21} />
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
