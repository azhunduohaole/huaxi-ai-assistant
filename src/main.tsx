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
type Scene = '技术综述' | '方向洞察' | '科学传播';
type StyleTone = string;
type Modal =
  | null
  | 'kbPicker'
  | 'sceneMenu'
  | 'styleMenu'
  | 'tempFile'
  | 'taskConfig'
  | 'frequencyMenu'
  | 'fileStatusMenu'
  | 'createKb'
  | 'upload'
  | 'report'
  | 'template'
  | 'mobileTools'
  | 'mobileScenes';

type Conversation = {
  id: string;
  title: string;
  date: string;
  summary: string;
  agent: Agent;
  pinned?: boolean;
  archived?: boolean;
};

type ToolConfig = {
  smartSearch: boolean;
  selectedKbs: string[];
  scene: Scene;
  style: StyleTone;
  tempFiles: string[];
};

type TaskItem = {
  id: string;
  title: string;
  focusArea: string;
  frequency: '每天' | '每周';
  time: string;
  status: 'enabled' | 'disabled' | 'abnormal';
  executedRounds: number;
  lastExecuteTime: string;
  nextExecuteTime: string;
  failureCount?: number;
  badge?: string;
};

type KnowledgeBase = {
  id: string;
  title: string;
  owner: string;
  files: number;
  desc: string;
  created: string;
};

type KnowledgeFile = {
  id: string;
  name: string;
  status: '未处理' | '处理中' | '处理完成' | '处理失败';
  progress: number;
  tone: 'gray' | 'blue' | 'orange';
  source: string;
  created: string;
};

type TemplateItem = {
  id: string;
  name: string;
  scene: string;
  prompt: string;
  creator: string;
  created: string;
};

type ConfirmRequest = {
  type: 'conversation' | 'task' | 'knowledgeBase' | 'knowledgeFile' | 'knowledgeFileBatch' | 'template';
  id: string;
  title: string;
  message: string;
};

const initialConversations: Conversation[] = [
  { id: 's-001', title: '冬眠的熊是一次性大量进食...', date: '2026年12月25日', summary: '比如生活在热带、亚热带地区的马来熊，它们的栖息地全年温暖，食物也相对稳定。', agent: 'secretary', pinned: true },
  { id: 's-002', title: '华熙在HA领域的最新研究成果', date: '2026年12月25日', summary: '围绕透明质酸原料、医美护理与再生医学相关资料进行知识检索。', agent: 'secretary' },
  { id: 's-003', title: '生物护理品原料四大业务领域', date: '2026年12月24日', summary: '梳理生物活性物、合成生物、功能糖及细胞工程等业务资料。', agent: 'secretary' },
  { id: 's-004', title: '抗衰老技术领域月度情报', date: '2026年12月23日', summary: '追踪法规、论文、专利和竞品动态，生成阶段性情报摘要。', agent: 'secretary' },
  { id: 'b-001', title: 'AI创新探索分析', date: '2026年12月22日', summary: '从开放问题出发连接不同领域知识，形成技术路径与概念启发。', agent: 'badchild' },
  { id: 's-005', title: '华熙当康品牌宣传资料', date: '2026年12月21日', summary: '检索品牌资料、产品卖点和公开传播素材。', agent: 'secretary' }
];

const todayLabel = '刚刚';
const defaultToolConfig: ToolConfig = {
  smartSearch: false,
  selectedKbs: ['知识库1', '研发资料库'],
  scene: '技术综述',
  style: '通用',
  tempFiles: []
};

const initialTaskRows: TaskItem[] = [
  {
    id: 'task-001',
    title: '抗衰老技术领域月度情报',
    focusArea: '关注抗衰技术专利、法规动态、竞品技术路线和科学文献进展',
    frequency: '每周',
    time: '14:37',
    status: 'enabled',
    executedRounds: 12,
    lastExecuteTime: '2026-03-24',
    nextExecuteTime: '2026-03-31',
    badge: '有新报告'
  },
  {
    id: 'task-002',
    title: '定时任务222222',
    focusArea: '透明质酸原料法规和竞品动态',
    frequency: '每天',
    time: '09:00',
    status: 'abnormal',
    failureCount: 1,
    executedRounds: 12,
    lastExecuteTime: '2026-03-24',
    nextExecuteTime: '2026-03-25'
  },
  {
    id: 'task-003',
    title: '定时任务333333',
    focusArea: '再生医学与外泌体技术趋势',
    frequency: '每周',
    time: '10:00',
    status: 'enabled',
    executedRounds: 8,
    lastExecuteTime: '2026-03-21',
    nextExecuteTime: '2026-03-28'
  }
];

const initialKbCards: KnowledgeBase[] = Array.from({ length: 6 }, (_, index) => ({
  id: `kb-${index + 1}`,
  title: index === 0 ? '华熙生物麦角硫因稳定性相关数据' : `知识库${index + 1}`,
  owner: index % 2 ? 'wangdazhuang' : '王大锤',
  files: index === 0 ? 200 : 16 + index,
  desc: '基于高通量测序技术的基因组分析项目，包含数据预处理、变异检测和功能注释等核心分析流程。',
  created: `${180 - index * 8}天前`
}));

const initialFileRows: KnowledgeFile[] = [
  { id: 'file-001', name: '蛋白设计方案.docx', status: '未处理', progress: 0, tone: 'gray', source: '本地上传', created: '2024/11/1 14:30:26' },
  { id: 'file-002', name: '麦角硫因稳定性.pdf', status: '处理中', progress: 50, tone: 'blue', source: '本地上传', created: '2024/11/1 14:30:26' },
  { id: 'file-003', name: '透明质酸功效研究.pdf', status: '处理完成', progress: 100, tone: 'blue', source: '本地上传', created: '2024/11/1 14:30:26' },
  { id: 'file-004', name: '法规动态摘录.txt', status: '处理失败', progress: 60, tone: 'orange', source: '本地上传', created: '2024/11/1 14:30:26' }
];

const quotaRows = [
  { title: '小秘书-联网模式', total: '1,000,000次/年', used: '467800' },
  { title: '小秘书-非联网模式', total: '25,000次/年', used: '7800' },
  { title: '坏孩子', total: '12,000次/年', used: '4678' }
];

const initialTemplates: TemplateItem[] = [
  { id: 'tpl-001', name: '通用科普模板', scene: '科学洞察', prompt: '用通俗语言解释技术原理，并保留关键数据来源。', creator: 'admin', created: '1天前' },
  { id: 'tpl-002', name: '严谨科研模板', scene: '科学洞察', prompt: '以科研报告口吻输出，强调证据、引用与风险边界。', creator: 'admin', created: '3天前' }
];

function App() {
  const [view, setView] = useState<View>('home');
  const [agent, setAgent] = useState<Agent>('secretary');
  const [modal, setModal] = useState<Modal>(null);
  const [notice, setNotice] = useState('');
  const [citationOpen, setCitationOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [historySearch, setHistorySearch] = useState('');
  const [draft, setDraft] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [activeConversationId, setActiveConversationId] = useState(initialConversations[0].id);
  const [toolConfig, setToolConfig] = useState<ToolConfig>(defaultToolConfig);
  const [tasks, setTasks] = useState<TaskItem[]>(initialTaskRows);
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>(initialKbCards);
  const [knowledgeFiles, setKnowledgeFiles] = useState<KnowledgeFile[]>(initialFileRows);
  const [templates, setTemplates] = useState<TemplateItem[]>(initialTemplates);
  const [confirmRequest, setConfirmRequest] = useState<ConfirmRequest | null>(null);
  const [taskDraft, setTaskDraft] = useState({ title: '', focusArea: '', frequency: '每天' as TaskItem['frequency'], time: '9:00' });
  const [selectedKbId, setSelectedKbId] = useState(initialKbCards[0].id);
  const [lastQuestion, setLastQuestion] = useState('帮我找出麦角硫因稳定性相关数据');
  const [copied, setCopied] = useState(false);
  const filteredConversations = useMemo(
    () =>
      conversations.filter((item) => {
        const keyword = historySearch.toLowerCase();
        return item.title.toLowerCase().includes(keyword) || item.summary.toLowerCase().includes(keyword);
      }),
    [conversations, historySearch]
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
    setModal(null);
    setMobileMenuOpen(false);
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0 });
      document.querySelector('.workspace')?.scrollTo({ top: 0, left: 0 });
      document.querySelector('.workspace > section')?.scrollTo({ top: 0, left: 0 });
    });
  };

  const activeConversation = conversations.find((item) => item.id === activeConversationId) ?? conversations[0];
  const styleOptions = useMemo(() => ['通用', '严谨', ...templates.map((item) => item.name)], [templates]);
  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 1800);
  };

  const startChat = (question = draft) => {
    const normalized = question.trim() || (agent === 'secretary' ? '华熙在HA领域的最新研究成果' : '抗衰技术创新方向');
    const title = normalized.length > 15 ? `${normalized.slice(0, 15)}...` : normalized;
    const id = `session-${Date.now()}`;
    const nextConversation: Conversation = {
      id,
      title,
      date: todayLabel,
      summary: agent === 'secretary' ? '正在生成回答...' : `DeepResearch 执行中：${toolConfig.scene} / ${toolConfig.style}`,
      agent
    };

    setConversations((items) => [nextConversation, ...items.filter((item) => item.id !== id)]);
    setActiveConversationId(id);
    setLastQuestion(normalized);
    setDraft('');
    setCitationOpen(false);
    openView('chat');
  };

  const updateToolConfig = (patch: Partial<ToolConfig>) => {
    setToolConfig((current) => ({ ...current, ...patch }));
  };

  const requestConfirm = (request: ConfirmRequest) => {
    setConfirmRequest(request);
    setModal(null);
  };

  const runConfirmedAction = () => {
    if (!confirmRequest) return;

    if (confirmRequest.type === 'conversation') {
      setConversations((items) => items.filter((item) => item.id !== confirmRequest.id));
      if (activeConversationId === confirmRequest.id) openView('home');
      showNotice('对话已删除');
    }

    if (confirmRequest.type === 'task') {
      setTasks((items) => items.filter((item) => item.id !== confirmRequest.id));
      showNotice('定时任务已删除');
    }

    if (confirmRequest.type === 'knowledgeBase') {
      setKnowledgeBases((items) => items.filter((item) => item.id !== confirmRequest.id));
      if (selectedKbId === confirmRequest.id) setSelectedKbId(knowledgeBases.find((item) => item.id !== confirmRequest.id)?.id ?? '');
      showNotice('知识库已删除');
    }

    if (confirmRequest.type === 'knowledgeFile') {
      setKnowledgeFiles((items) => items.filter((item) => item.id !== confirmRequest.id));
      setKnowledgeBases((items) => items.map((item) => (item.id === selectedKbId ? { ...item, files: Math.max(0, item.files - 1) } : item)));
      showNotice('文件已删除');
    }

    if (confirmRequest.type === 'knowledgeFileBatch') {
      const ids = confirmRequest.id.split(',').filter(Boolean);
      setKnowledgeFiles((items) => items.filter((item) => !ids.includes(item.id)));
      setKnowledgeBases((items) => items.map((item) => (item.id === selectedKbId ? { ...item, files: Math.max(0, item.files - ids.length) } : item)));
      showNotice('已批量删除文件');
    }

    if (confirmRequest.type === 'template') {
      const removed = templates.find((item) => item.id === confirmRequest.id);
      setTemplates((items) => items.filter((item) => item.id !== confirmRequest.id));
      if (removed && toolConfig.style === removed.name) updateToolConfig({ style: '通用' });
      showNotice('模板已删除');
    }

    setConfirmRequest(null);
  };

  const createTask = (patch?: Partial<typeof taskDraft>) => {
    const source = { ...taskDraft, ...patch };
    const focusArea = source.focusArea.trim();
    if (!focusArea) {
      showNotice('请输入关注领域');
      return;
    }

    const title = source.title.trim() || `${focusArea.slice(0, 14)}${source.frequency === '每天' ? '日报' : '周报'}`;
    const nextTask: TaskItem = {
      id: `task-${Date.now()}`,
      title,
      focusArea,
      frequency: source.frequency,
      time: source.time,
      status: 'enabled',
      executedRounds: 0,
      lastExecuteTime: '待执行',
      nextExecuteTime: source.frequency === '每天' ? `明天 ${source.time}` : `下周一 ${source.time}`,
      badge: '新任务'
    };
    setTasks((items) => [nextTask, ...items]);
    setTaskDraft((current) => ({ ...current, title: '', focusArea: '' }));
    showNotice('定时任务已发布');
  };

  const updateTask = (id: string, patch: Partial<TaskItem>) => {
    setTasks((items) => items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const testTask = (id: string) => {
    setTasks((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              status: 'enabled',
              failureCount: 0,
              executedRounds: item.executedRounds + 1,
              lastExecuteTime: '刚刚',
              badge: '有新报告'
            }
          : item
      )
    );
    showNotice('测试任务已触发');
  };

  const deleteTask = (id: string) => {
    const task = tasks.find((item) => item.id === id);
    requestConfirm({
      type: 'task',
      id,
      title: '删除定时任务',
      message: `确认删除「${task?.title ?? '该任务'}」？删除后将不再推送报告。`
    });
  };

  const createKnowledgeBase = (name: string, desc: string) => {
    const normalized = name.trim();
    if (!normalized) {
      showNotice('请输入知识库名称');
      return;
    }
    if (knowledgeBases.some((item) => item.title === normalized)) {
      showNotice('知识库名称已存在，请更换名称');
      return;
    }
    const next: KnowledgeBase = {
      id: `kb-${Date.now()}`,
      title: normalized,
      owner: '王大锤',
      files: 0,
      desc: desc.trim() || '暂无描述',
      created: '刚刚'
    };
    setKnowledgeBases((items) => [next, ...items]);
    setSelectedKbId(next.id);
    showNotice('知识库已创建');
    setModal(null);
  };

  const deleteKnowledgeBase = (id: string) => {
    const kb = knowledgeBases.find((item) => item.id === id);
    requestConfirm({
      type: 'knowledgeBase',
      id,
      title: '删除知识库',
      message: `确认删除「${kb?.title ?? '该知识库'}」？关联文件和检索配置将同步移除。`
    });
  };

  const renameKnowledgeBase = (id: string, title: string) => {
    const normalized = title.trim();
    if (!normalized) {
      showNotice('知识库名称不能为空');
      return;
    }
    if (knowledgeBases.some((item) => item.id !== id && item.title === normalized)) {
      showNotice('知识库名称已存在，请更换名称');
      return;
    }
    setKnowledgeBases((items) => items.map((item) => (item.id === id ? { ...item, title: normalized } : item)));
    showNotice('知识库已重命名');
  };

  const uploadKnowledgeFile = (fileName: string) => {
    const normalized = fileName.trim() || `新上传资料_${knowledgeFiles.length + 1}.pdf`;
    const next: KnowledgeFile = {
      id: `file-${Date.now()}`,
      name: normalized,
      status: '未处理',
      progress: 0,
      tone: 'gray',
      source: '本地上传',
      created: '刚刚'
    };
    setKnowledgeFiles((items) => [next, ...items]);
    setKnowledgeBases((items) => items.map((item) => (item.id === selectedKbId ? { ...item, files: item.files + 1 } : item)));
    showNotice('文件已加入处理队列');
    setModal(null);
  };

  const deleteKnowledgeFile = (id: string) => {
    const file = knowledgeFiles.find((item) => item.id === id);
    requestConfirm({
      type: 'knowledgeFile',
      id,
      title: '删除文件',
      message: `确认删除「${file?.name ?? '该文件'}」？删除后将无法参与知识库检索。`
    });
  };

  const deleteKnowledgeFiles = (ids: string[]) => {
    if (!ids.length) {
      showNotice('请选择需要删除的文件');
      return;
    }
    requestConfirm({
      type: 'knowledgeFileBatch',
      id: ids.join(','),
      title: '批量删除文件',
      message: `确认删除已选中的 ${ids.length} 个文件？删除后将无法参与知识库检索。`
    });
  };

  const downloadKnowledgeFile = (file: KnowledgeFile) => {
    const blob = new Blob([`# ${file.name}\n\n来源：${file.source}\n状态：${file.status}\n创建时间：${file.created}\n`], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name.replace(/\.[^.]+$/, '') + '.md';
    link.click();
    URL.revokeObjectURL(url);
    showNotice('文件下载已开始');
  };

  const createTemplate = (name: string, prompt: string) => {
    const normalized = name.trim();
    if (!normalized) {
      showNotice('请输入模板名称');
      return;
    }
    const next: TemplateItem = {
      id: `tpl-${Date.now()}`,
      name: normalized,
      scene: '科学洞察',
      prompt: prompt.trim() || '按科学传播场景输出，语言清晰可信。',
      creator: 'admin',
      created: '刚刚'
    };
    setTemplates((items) => [next, ...items]);
    showNotice('模板已创建');
    setModal(null);
  };

  const deleteTemplate = (id: string) => {
    const template = templates.find((item) => item.id === id);
    requestConfirm({
      type: 'template',
      id,
      title: '删除风格模板',
      message: `确认删除「${template?.name ?? '该模板'}」？坏孩子风格选择中将不再显示。`
    });
  };

  return (
    <div className={`prototype-shell ${citationOpen && view === 'chat' ? 'with-citation' : ''}`}>
      <WindowChrome />
      <FeishuRail />
      <AppSidebar
        view={view}
        conversations={filteredConversations}
        search={historySearch}
        setSearch={setHistorySearch}
        openView={openView}
        activeConversationId={activeConversationId}
        setActiveConversationId={setActiveConversationId}
        setAgent={setAgent}
        renameConversation={(id, title) =>
          setConversations((items) => items.map((item) => (item.id === id ? { ...item, title: title.trim() || item.title } : item)))
        }
        togglePinConversation={(id) =>
          setConversations((items) =>
            items
              .map((item) => (item.id === id ? { ...item, pinned: !item.pinned } : item))
              .sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)))
          )
        }
        deleteConversation={(id) => {
          const conversation = conversations.find((item) => item.id === id);
          requestConfirm({
            type: 'conversation',
            id,
            title: '删除对话',
            message: `确认删除「${conversation?.title ?? '该对话'}」？删除后不可恢复。`
          });
        }}
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
        {view === 'home' && (
          <HomeView
            agent={agent}
            setAgent={setAgent}
            setModal={setModal}
            startChat={startChat}
            draft={draft}
            setDraft={setDraft}
            toolConfig={toolConfig}
            updateToolConfig={updateToolConfig}
          />
        )}
        {view === 'chat' && (
          <ChatView
            agent={activeConversation?.agent ?? agent}
            setAgent={setAgent}
            setModal={setModal}
            setCitationOpen={setCitationOpen}
            draft={draft}
            setDraft={setDraft}
            toolConfig={toolConfig}
            updateToolConfig={updateToolConfig}
            startChat={startChat}
            lastQuestion={lastQuestion}
            copied={copied}
            setCopied={setCopied}
          />
        )}
        {view === 'history' && <HistoryView search={historySearch} setSearch={setHistorySearch} conversations={filteredConversations} />}
        {view === 'tasks' && (
          <TasksView
            setModal={setModal}
            tasks={tasks}
            taskDraft={taskDraft}
            setTaskDraft={setTaskDraft}
            createTask={createTask}
            updateTask={updateTask}
            testTask={testTask}
            deleteTask={deleteTask}
          />
        )}
        {view === 'knowledge' && (
          <KnowledgeView
            setView={setView}
            setModal={setModal}
            knowledgeBases={knowledgeBases}
            setSelectedKbId={setSelectedKbId}
            renameKnowledgeBase={renameKnowledgeBase}
            deleteKnowledgeBase={deleteKnowledgeBase}
          />
        )}
        {view === 'kbDetail' && (
          <KnowledgeDetail
            setView={setView}
            setModal={setModal}
            knowledgeBase={knowledgeBases.find((item) => item.id === selectedKbId) ?? knowledgeBases[0]}
            files={knowledgeFiles}
            deleteKnowledgeFile={deleteKnowledgeFile}
            deleteKnowledgeFiles={deleteKnowledgeFiles}
            downloadKnowledgeFile={downloadKnowledgeFile}
          />
        )}
        {view === 'admin' && <AdminView setModal={setModal} openView={openView} templates={templates} deleteTemplate={deleteTemplate} />}
      </main>
      {citationOpen && view === 'chat' && <CitationDrawer onClose={() => setCitationOpen(false)} />}
      {modal && (
        <ModalLayer
          type={modal}
          close={() => setModal(null)}
          setModal={setModal}
          toolConfig={toolConfig}
          updateToolConfig={updateToolConfig}
          styleOptions={styleOptions}
          knowledgeBases={knowledgeBases}
          createTask={createTask}
          createKnowledgeBase={createKnowledgeBase}
          uploadKnowledgeFile={uploadKnowledgeFile}
          createTemplate={createTemplate}
        />
      )}
      {confirmRequest && (
        <ConfirmModal
          request={confirmRequest}
          close={() => setConfirmRequest(null)}
          confirm={runConfirmedAction}
        />
      )}
      {(copied || notice) && <div className="toast">{notice || '已复制'}</div>}
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
    { label: '消息', icon: <Bell size={21} /> },
    { label: '视频会议', icon: <MessageCircle size={20} /> },
    { label: '日历', icon: <Clock3 size={20} /> },
    { label: '云文档', icon: <FileText size={20} /> },
    { label: '多维表格', icon: <Square size={20} /> },
    { label: '工作台', icon: <GridMark /> },
    { label: '通讯录', icon: <Bot size={20} /> },
    { label: '权益升级', icon: <Globe2 size={19} /> },
    { label: '飞书 aily', icon: <Bot size={19} /> },
    { label: '更多', icon: <BookOpen size={19} /> },
    { label: '工作台设置', icon: <Circle size={18} /> },
    { label: '多维表格', icon: <Square size={18} /> }
  ];

  return (
    <aside className="feishu-rail" aria-label="飞书导航">
      <div className="user-avatar" />
      <button className="feishu-search-row" aria-label="搜索">
        <Search size={15} />
        <span>搜索 (⌘+K)</span>
      </button>
      {rail.map((item, index) => (
        <button key={`${item.label}-${index}`} className={`feishu-item ${item.label === '工作台' ? 'active' : ''}`} aria-label={item.label}>
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
  search,
  setSearch,
  openView,
  activeConversationId,
  setActiveConversationId,
  setAgent,
  renameConversation,
  togglePinConversation,
  deleteConversation,
  mobileMenuOpen,
  closeMobileMenu
}: {
  view: View;
  conversations: Conversation[];
  search: string;
  setSearch: (value: string) => void;
  openView: (view: View) => void;
  activeConversationId: string;
  setActiveConversationId: (id: string) => void;
  setAgent: (agent: Agent) => void;
  renameConversation: (id: string, title: string) => void;
  togglePinConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  mobileMenuOpen: boolean;
  closeMobileMenu: () => void;
}) {
  const adminMode = view === 'admin';
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const pinnedConversations = conversations.filter((item) => item.pinned);
  const regularConversations = conversations.filter((item) => !item.pinned);
  const conversationGroups = search.trim()
    ? [{ label: '搜索结果', items: conversations }]
    : [
        { label: '置顶', items: pinnedConversations },
        { label: '昨天', items: regularConversations.slice(0, 2) },
        { label: '前7天', items: regularConversations.slice(2, 3) },
        { label: '过去30天', items: regularConversations.slice(3, 4) },
        { label: '更早', items: regularConversations.slice(4) }
      ].filter((group) => group.items.length);

  const saveEditing = () => {
    if (!editingId) return;
    renameConversation(editingId, editingTitle);
    setEditingId(null);
    setEditingTitle('');
  };

  return (
    <aside className={`app-sidebar ${mobileMenuOpen ? 'open' : ''} ${adminMode ? 'admin-sidebar' : ''}`}>
      <div className="app-title">
        <RobotFace small agent="secretary" />
        <strong>{adminMode ? '华熙AI知识助手管理端' : '华熙AI知识助手'}</strong>
        <button aria-label="关闭移动菜单" className="sidebar-close" onClick={closeMobileMenu}>
          <X size={18} />
        </button>
        <Menu size={20} className="desktop-collapse" />
      </div>
      {!adminMode && (
        <div className="sidebar-search">
          <Search size={15} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="搜索对话名称" />
          {search && (
            <button aria-label="清空搜索" onClick={() => setSearch('')}>
              <X size={13} />
            </button>
          )}
        </div>
      )}
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
              新建对话
            </button>
            <button className={view === 'knowledge' || view === 'kbDetail' ? 'active' : ''} onClick={() => openView('knowledge')}>
              <BookOpen size={16} />
              知识库
            </button>
            <button className={view === 'tasks' ? 'active' : ''} onClick={() => openView('tasks')}>
              <Clock3 size={17} />
              定时任务
            </button>
          </>
        )}
      </nav>
      {!adminMode && (
        <>
          <div className="side-history">
            {conversationGroups.map((group) => (
              <React.Fragment key={group.label}>
                <span className="side-group-label">{group.label}</span>
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    className={item.id === activeConversationId ? 'current' : ''}
                    onClick={() => {
                      setActiveConversationId(item.id);
                      setAgent(item.agent);
                      openView('chat');
                    }}
                  >
                    <span className={`conversation-mark ${item.agent}`} aria-hidden="true" />
                    {editingId === item.id ? (
                      <input
                        className="conversation-edit"
                        value={editingTitle}
                        autoFocus
                        onClick={(event) => event.stopPropagation()}
                        onChange={(event) => setEditingTitle(event.target.value.slice(0, 20))}
                        onBlur={saveEditing}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') saveEditing();
                          if (event.key === 'Escape') setEditingId(null);
                        }}
                      />
                    ) : (
                      <strong>{item.title}</strong>
                    )}
                    <span className="conversation-actions" aria-hidden="true">
                      <i
                        onClick={(event) => {
                          event.stopPropagation();
                          setEditingId(item.id);
                          setEditingTitle(item.title);
                        }}
                      >
                        <Edit3 size={16} />
                      </i>
                      <i
                        onClick={(event) => {
                          event.stopPropagation();
                          togglePinConversation(item.id);
                        }}
                      >
                        <Circle size={16} />
                      </i>
                      <i
                        onClick={(event) => {
                          event.stopPropagation();
                          deleteConversation(item.id);
                        }}
                      >
                        <Trash2 size={16} />
                      </i>
                    </span>
                  </button>
                ))}
              </React.Fragment>
            ))}
            {!conversations.length && <div className="side-empty">未找到匹配的对话</div>}
          </div>
          <button className="all-history" onClick={() => openView('history')}>
            全部会话 <span>&gt;&gt;</span>
          </button>
          <div className="agent-shortcuts">
            <span>华熙</span>
            <button onClick={() => openView('admin')} aria-label="进入华熙AI知识助手管理端">
              <RobotFace micro agent="secretary" />
              <strong>华熙AI知识助手</strong>
            </button>
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
  startChat,
  draft,
  setDraft,
  toolConfig,
  updateToolConfig
}: {
  agent: Agent;
  setAgent: (agent: Agent) => void;
  setModal: (modal: Modal) => void;
  startChat: (question?: string) => void;
  draft: string;
  setDraft: (value: string) => void;
  toolConfig: ToolConfig;
  updateToolConfig: (patch: Partial<ToolConfig>) => void;
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
      <PromptBox
        agent={agent}
        setAgent={setAgent}
        setModal={setModal}
        onSend={startChat}
        draft={draft}
        setDraft={setDraft}
        toolConfig={toolConfig}
        updateToolConfig={updateToolConfig}
      />
      <SuggestionList agent={agent} onSelect={startChat} />
    </section>
  );
}

function PromptBox({
  agent,
  setAgent,
  setModal,
  onSend,
  draft,
  setDraft,
  toolConfig,
  updateToolConfig,
  compact
}: {
  agent: Agent;
  setAgent: (agent: Agent) => void;
  setModal: (modal: Modal) => void;
  onSend?: (question?: string) => void;
  draft: string;
  setDraft: (value: string) => void;
  toolConfig: ToolConfig;
  updateToolConfig: (patch: Partial<ToolConfig>) => void;
  compact?: boolean;
}) {
  const placeholder =
    agent === 'secretary'
      ? '输入您的问题，小秘书将为您找到最相关的答案'
      : '输入一个开放性问题，AI将连接不同领域知识，生成技术综述并启发创新方向。';

  const submit = () => onSend?.(draft);

  return (
    <div className={`prompt-box agent-${agent} ${compact ? 'compact' : ''}`}>
      <div className="prompt-line">
        <AgentPill agent={agent} setAgent={setAgent} />
        <textarea
          className="prompt-input"
          value={draft}
          placeholder={placeholder}
          rows={compact ? 1 : 2}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
              event.preventDefault();
              submit();
            }
          }}
        />
      </div>
      <div className="prompt-tools">
        {agent === 'secretary' ? (
          <>
            <button className="icon-chip" aria-label="添加临时文件" onClick={() => setModal('tempFile')}>
              <LinkGlyph />
            </button>
            <button className={`tool-chip ${toolConfig.smartSearch ? 'active' : ''}`} onClick={() => updateToolConfig({ smartSearch: !toolConfig.smartSearch })}>
              <Bot size={15} />
              智能搜索{toolConfig.smartSearch ? '已开' : ''}
            </button>
            <button className="tool-chip kb-tool" onClick={() => setModal('kbPicker')}>
              <Bot size={15} />
              知识库({toolConfig.selectedKbs.length})
            </button>
            <button className={`tool-chip ${toolConfig.scene === '技术综述' ? 'active' : ''}`} onClick={() => setModal('sceneMenu')}>
              {toolConfig.scene}
              <ChevronDown size={14} />
            </button>
          </>
        ) : (
          <>
            <button className="tool-chip kb-tool" onClick={() => setModal('kbPicker')}>
              <Bot size={15} />
              知识库({toolConfig.selectedKbs.length})
            </button>
            <button className="tool-chip" onClick={() => setModal('sceneMenu')}>
              {toolConfig.scene}
              <ChevronDown size={14} />
            </button>
            <button className="tool-chip" onClick={() => setModal('styleMenu')}>
              {toolConfig.style}
              <ChevronDown size={14} />
            </button>
          </>
        )}
        <button className="send-circle" aria-label="发送" onClick={submit}>
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

function SuggestionList({ agent, onSelect }: { agent: Agent; onSelect: (question?: string) => void }) {
  const badchildSuggestions = ['AI创新探索分析', '再生医学赋能抗衰护肤', '透明质酸跨领域应用机会'];
  const secretarySuggestions = ['华熙在HA领域的最新研究成果', '生物护理品原料包含的四大业务领域讲解', '华熙当康、生物科技品牌宣传资料'];

  if (agent === 'badchild') {
    return (
      <div className="suggestion-area badchild">
        <span>试试这些示例:</span>
        <div className="report-suggestions">
          {badchildSuggestions.map((item) => (
            <button key={item} className="report-suggestion" onClick={() => onSelect(item)}>
              <ReportIcon />
              {item}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="suggestion-area">
      <span>试试这些示例:</span>
      {secretarySuggestions.map((item) => (
        <button key={item} onClick={() => onSelect(item)}>
          {item}
        </button>
      ))}
    </div>
  );
}

function ChatView({
  agent,
  setAgent,
  setModal,
  setCitationOpen,
  draft,
  setDraft,
  toolConfig,
  updateToolConfig,
  startChat,
  lastQuestion,
  copied,
  setCopied
}: {
  agent: Agent;
  setAgent: (agent: Agent) => void;
  setModal: (modal: Modal) => void;
  setCitationOpen: (open: boolean) => void;
  draft: string;
  setDraft: (value: string) => void;
  toolConfig: ToolConfig;
  updateToolConfig: (patch: Partial<ToolConfig>) => void;
  startChat: (question?: string) => void;
  lastQuestion: string;
  copied: boolean;
  setCopied: (copied: boolean) => void;
}) {
  return (
    <section className="chat-stage">
      <div className="breadcrumb">
        {lastQuestion} <ChevronRight size={18} />
      </div>
      {agent === 'secretary' ? (
        <SecretaryAnswer setCitationOpen={setCitationOpen} lastQuestion={lastQuestion} copied={copied} setCopied={setCopied} toolConfig={toolConfig} />
      ) : (
        <BadChildAnswer setModal={setModal} lastQuestion={lastQuestion} toolConfig={toolConfig} />
      )}
      <div className="fixed-composer">
        <PromptBox
          agent={agent}
          setAgent={setAgent}
          setModal={setModal}
          onSend={startChat}
          draft={draft}
          setDraft={setDraft}
          toolConfig={toolConfig}
          updateToolConfig={updateToolConfig}
          compact
        />
      </div>
    </section>
  );
}

function SecretaryAnswer({
  setCitationOpen,
  lastQuestion,
  copied,
  setCopied,
  toolConfig
}: {
  setCitationOpen: (open: boolean) => void;
  lastQuestion: string;
  copied: boolean;
  setCopied: (copied: boolean) => void;
  toolConfig: ToolConfig;
}) {
  const copyAnswer = async () => {
    const text = '根据知识库搜索结果，我为您整理了麦角硫因稳定性相关数据，包括热稳定性、关键稳定性机制与引用来源。';
    try {
      await navigator.clipboard?.writeText(text);
    } catch {
      // Clipboard permissions are browser-dependent in static previews.
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className="answer-flow">
      <div className="user-bubble">{lastQuestion}</div>
      <div className="assistant-row">
        <RobotFace micro agent="secretary" />
        <div className="answer-main">
          <p className="answer-ask">我来帮您搜索麦角硫因（Ergothioneine）稳定性相关的研究数据。</p>
          <div className="answer-meta">
            <span>{toolConfig.smartSearch ? '已启用智能搜索' : '未启用智能搜索'}</span>
            <span>知识库 {toolConfig.selectedKbs.length} 个</span>
            <span>{toolConfig.scene}</span>
          </div>
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
            <div className="answer-actions">
              <button onClick={copyAnswer}>
                <Copy size={16} />
                {copied ? '已复制' : '复制'}
              </button>
              <button onClick={() => setCitationOpen(true)}>查看引用</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BadChildAnswer({ setModal, lastQuestion, toolConfig }: { setModal: (modal: Modal) => void; lastQuestion: string; toolConfig: ToolConfig }) {
  const steps = [
    { title: '需求解析', status: '完成' },
    { title: '信息检索', status: '完成' },
    { title: '资料整理', status: '完成' },
    { title: '报告生成', status: '完成' }
  ];
  const reportText = `# AI创新洞察报告:再生医学赋能抗衰护肤

## 研究问题
${lastQuestion}

## 执行配置
- 场景: ${toolConfig.scene}
- 风格: ${toolConfig.style}
- 知识库: ${toolConfig.selectedKbs.join('、') || '未选择'}

## 技术路径综述
围绕再生医学、透明质酸和抗衰护肤场景，系统梳理可验证资料、潜在技术路线和产品概念。
`;
  const downloadReport = (format: 'markdown' | 'pdf' | 'word') => {
    const ext = format === 'markdown' ? 'md' : format === 'pdf' ? 'pdf' : 'doc';
    const mime = format === 'markdown' ? 'text/markdown;charset=utf-8' : format === 'pdf' ? 'application/pdf' : 'application/msword';
    const blob = new Blob([reportText], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AI创新洞察报告.${ext}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="answer-flow badchild-answer">
      <div className="user-bubble">{lastQuestion}</div>
      <div className="path-card">
        <strong>研究完成</strong>
        <span>
          已按「{toolConfig.scene} / {toolConfig.style}」完成科研探索。
        </span>
        <div className="task-path">
          {steps.map((step, index) => (
            <div className="path-step" key={step.title}>
              <i>{index + 1}</i>
              <strong>{step.title}</strong>
              <small>{step.status}</small>
            </div>
          ))}
        </div>
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
          <button onClick={(event) => { event.stopPropagation(); downloadReport('markdown'); }}>导出为markdown</button>
          <button onClick={(event) => { event.stopPropagation(); downloadReport('pdf'); }}>导出为PDF</button>
          <button onClick={(event) => { event.stopPropagation(); downloadReport('word'); }}>导出为word</button>
        </div>
      </div>
    </div>
  );
}

function HistoryView({
  search,
  setSearch,
  conversations
}: {
  search: string;
  setSearch: (search: string) => void;
  conversations: Conversation[];
}) {
  return (
    <section className="panel-page history-page">
      <h1>历史会话</h1>
      <div className="wide-search">
        <Search size={21} />
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="搜索历史会话" />
        {search && <button onClick={() => setSearch('')} aria-label="清空历史搜索"><X size={18} /></button>}
      </div>
      {conversations.length ? (
        <TimelineGroup label={search ? '搜索结果' : '今天'} conversations={conversations} />
      ) : (
        <div className="history-empty">未找到匹配的会话，请尝试其他关键词</div>
      )}
    </section>
  );
}

function TimelineGroup({ label, conversations }: { label: string; conversations: Conversation[] }) {
  return (
    <div className="timeline-group">
      <span>{label}</span>
      {conversations.map((row) => (
        <article className="history-row" key={row.id}>
          <div>
            <strong>{row.title}</strong>
            <p>{row.summary}</p>
          </div>
          <footer>
            <small>{row.agent === 'secretary' ? '小秘书' : '坏孩子'} ｜ {row.agent === 'secretary' ? '知识检索' : '创新探索'} ｜ {row.date}</small>
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

function TasksView({
  setModal,
  tasks,
  taskDraft,
  setTaskDraft,
  createTask,
  updateTask,
  testTask,
  deleteTask
}: {
  setModal: (modal: Modal) => void;
  tasks: TaskItem[];
  taskDraft: { title: string; focusArea: string; frequency: TaskItem['frequency']; time: string };
  setTaskDraft: React.Dispatch<React.SetStateAction<{ title: string; focusArea: string; frequency: TaskItem['frequency']; time: string }>>;
  createTask: () => void;
  updateTask: (id: string, patch: Partial<TaskItem>) => void;
  testTask: (id: string) => void;
  deleteTask: (id: string) => void;
}) {
  const statusMap: Record<TaskItem['status'], { text: string; color: string }> = {
    enabled: { text: '启用中', color: 'green' },
    disabled: { text: '已终止', color: 'gray' },
    abnormal: { text: '异常（1次任务执行失败）', color: 'orange' }
  };

  return (
    <section className="task-page">
      <h1 className="task-page-title">定时任务</h1>
      <div className="task-hero">
        <RobotFace />
        <p>选择关注领域、时间范围并创建定时任务，AI将自动汇总最新的技术、法规和竞品动态。</p>
        <div className="task-create-bar">
          <input
            className="task-title-input"
            value={taskDraft.title}
            onChange={(event) => setTaskDraft((current) => ({ ...current, title: event.target.value }))}
            placeholder="任务标题（选填）"
          />
          <textarea
            className="task-desc-input"
            value={taskDraft.focusArea}
            onChange={(event) => setTaskDraft((current) => ({ ...current, focusArea: event.target.value }))}
            placeholder="在此描述您的关注领域或要点（必填）"
          />
          <button
            className="select-button frequency-trigger"
            onClick={() => setTaskDraft((current) => ({ ...current, frequency: current.frequency === '每天' ? '每周' : '每天' }))}
            aria-haspopup="menu"
          >
            {taskDraft.frequency} <ChevronDown size={16} />
          </button>
          <button
            className="select-button time-trigger"
            onClick={() => setTaskDraft((current) => ({ ...current, time: current.time === '9:00' ? '14:00' : '9:00' }))}
            aria-haspopup="dialog"
          >
            {taskDraft.time} <ChevronDown size={16} />
          </button>
          <button className="config-button" onClick={() => setModal('taskConfig')} aria-label="更多配置">
            <Filter size={21} />
          </button>
          <button className="primary-action" onClick={createTask}>发布任务</button>
        </div>
      </div>
      <div className="task-list">
        {tasks.map((task) => {
          const status = statusMap[task.status];
          return (
          <article key={task.id} className="task-card">
            {task.badge && <span className="new-report">{task.badge}</span>}
            <ReportIcon />
            <div>
              <h2>
                {task.title}
                <span className={`dot ${status.color}`} />
                <em>{task.status === 'abnormal' ? `异常（${task.failureCount ?? 1}次任务执行失败）` : status.text}</em>
              </h2>
              <p>{task.focusArea}</p>
              <footer>频次：{task.frequency} {task.time} ｜ 已执行轮次：{task.executedRounds} ｜ 最新执行时间：{task.lastExecuteTime} ｜ 下次执行时间：{task.nextExecuteTime}</footer>
            </div>
            <div className="hover-actions">
              {(task.status === 'enabled' || task.status === 'abnormal') && <button className="tooltip" onClick={() => testTask(task.id)}>测试</button>}
              <button onClick={() => updateTask(task.id, { status: task.status === 'disabled' ? 'enabled' : 'disabled' })} aria-label={task.status === 'disabled' ? '启用任务' : '终止任务'}>
                <RotateCw size={19} />
              </button>
              <button
                onClick={() =>
                  setTaskDraft({
                    title: task.title,
                    focusArea: task.focusArea,
                    frequency: task.frequency,
                    time: task.time
                  })
                }
                aria-label="编辑任务"
              >
                <Edit3 size={19} />
              </button>
              <button onClick={() => updateTask(task.id, { status: task.status === 'abnormal' ? 'enabled' : 'abnormal', failureCount: 1 })} aria-label="切换任务状态">
                <Circle size={19} />
              </button>
              <button onClick={() => deleteTask(task.id)} aria-label="删除任务">
                <Trash2 size={19} />
              </button>
            </div>
          </article>
          );
        })}
      </div>
    </section>
  );
}

function KnowledgeView({
  setView,
  setModal,
  knowledgeBases,
  setSelectedKbId,
  renameKnowledgeBase,
  deleteKnowledgeBase
}: {
  setView: (view: View) => void;
  setModal: (modal: Modal) => void;
  knowledgeBases: KnowledgeBase[];
  setSelectedKbId: (id: string) => void;
  renameKnowledgeBase: (id: string, title: string) => void;
  deleteKnowledgeBase: (id: string) => void;
}) {
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<'created' | 'files'>('created');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renamingTitle, setRenamingTitle] = useState('');
  const visibleKnowledgeBases = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return knowledgeBases
      .filter((item) => `${item.title} ${item.desc} ${item.owner}`.toLowerCase().includes(keyword))
      .sort((a, b) => (sortBy === 'files' ? b.files - a.files : parseInt(b.created, 10) - parseInt(a.created, 10)));
  }, [knowledgeBases, query, sortBy]);

  const saveRename = () => {
    if (!renamingId) return;
    renameKnowledgeBase(renamingId, renamingTitle);
    setRenamingId(null);
    setRenamingTitle('');
  };

  return (
    <section className="knowledge-page">
      <div className="knowledge-toolbar">
        <h1>知识库</h1>
        <div className="table-search">
          <Search size={20} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="支持文件名称/关键词搜索" />
        </div>
        <button className="sort-select" onClick={() => setSortBy((current) => (current === 'created' ? 'files' : 'created'))}>
          {sortBy === 'created' ? '按创建时间排序' : '按文件数排序'} <ChevronDown size={16} />
        </button>
        <button className="muted-primary" onClick={() => setModal('createKb')}>
          创建知识库
        </button>
      </div>
      <div className="kb-grid-real">
        {visibleKnowledgeBases.map((card) => (
          <article
            key={card.id}
            className={`kb-card-real ${openMenuId === card.id ? 'selected show-menu' : ''} ${renamingId === card.id ? 'renaming' : ''}`}
            onClick={() => {
              if (renamingId === card.id) return;
              setSelectedKbId(card.id);
              setView('kbDetail');
            }}
          >
            <button
              className="kb-more"
              aria-label="更多操作"
              onClick={(event) => {
                event.stopPropagation();
                setOpenMenuId((current) => (current === card.id ? null : card.id));
              }}
            >
              <MoreHorizontal size={16} />
            </button>
            {renamingId === card.id ? (
              <input
                className="kb-rename-input"
                value={renamingTitle}
                autoFocus
                onClick={(event) => event.stopPropagation()}
                onChange={(event) => setRenamingTitle(event.target.value.slice(0, 40))}
                onBlur={saveRename}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') saveRename();
                  if (event.key === 'Escape') {
                    setRenamingId(null);
                    setRenamingTitle('');
                  }
                }}
              />
            ) : (
              <h2>{card.title}</h2>
            )}
            <p>{card.desc}</p>
            <footer>
              {card.owner} <i /> {card.created} <i /> {card.files}个文件
            </footer>
            {openMenuId === card.id && (
              <div className="kb-action-menu" onClick={(event) => event.stopPropagation()}>
                <button
                  onClick={() => {
                    setRenamingId(card.id);
                    setRenamingTitle(card.title);
                    setOpenMenuId(null);
                  }}
                >
                  <Edit3 size={14} />
                  重命名
                </button>
                <button
                  className="danger"
                  onClick={() => {
                    setOpenMenuId(null);
                    deleteKnowledgeBase(card.id);
                  }}
                >
                  <Trash2 size={14} />
                  删除
                </button>
              </div>
            )}
          </article>
        ))}
      </div>
      {!visibleKnowledgeBases.length && <div className="kb-empty-state">未找到匹配的知识库</div>}
      <Pagination />
    </section>
  );
}

function KnowledgeDetail({
  setView,
  setModal,
  knowledgeBase,
  files,
  deleteKnowledgeFile,
  deleteKnowledgeFiles,
  downloadKnowledgeFile
}: {
  setView: (view: View) => void;
  setModal: (modal: Modal) => void;
  knowledgeBase?: KnowledgeBase;
  files: KnowledgeFile[];
  deleteKnowledgeFile: (id: string) => void;
  deleteKnowledgeFiles: (ids: string[]) => void;
  downloadKnowledgeFile: (file: KnowledgeFile) => void;
}) {
  const statusOptions: Array<'全部' | KnowledgeFile['status']> = ['全部', '未处理', '处理中', '处理失败', '处理完成'];
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'全部' | KnowledgeFile['status']>('全部');
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  const visibleFiles = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return files.filter((file) => {
      const matchKeyword = `${file.name} ${file.source}`.toLowerCase().includes(keyword);
      const matchStatus = statusFilter === '全部' || file.status === statusFilter;
      return matchKeyword && matchStatus;
    });
  }, [files, query, statusFilter]);
  const allVisibleSelected = visibleFiles.length > 0 && visibleFiles.every((file) => selectedFileIds.includes(file.id));
  const selectedFiles = visibleFiles.filter((file) => selectedFileIds.includes(file.id));

  useEffect(() => {
    setSelectedFileIds((ids) => ids.filter((id) => files.some((file) => file.id === id)));
  }, [files]);

  const toggleVisibleSelection = () => {
    if (allVisibleSelected) {
      setSelectedFileIds((ids) => ids.filter((id) => !visibleFiles.some((file) => file.id === id)));
      return;
    }
    setSelectedFileIds((ids) => Array.from(new Set([...ids, ...visibleFiles.map((file) => file.id)])));
  };

  const cycleStatusFilter = () => {
    const current = statusOptions.indexOf(statusFilter);
    setStatusFilter(statusOptions[(current + 1) % statusOptions.length]);
  };

  return (
    <section className="kb-detail-page">
      <div className="detail-title">
        <button onClick={() => setView('knowledge')}>
          <ChevronLeft size={24} />
        </button>
        <h1>{knowledgeBase?.title ?? '知识库名称'}</h1>
      </div>
      <div className="file-toolbar">
        <button className="muted-primary" onClick={() => setModal('upload')}>
          上传文件
        </button>
        <button className="muted-primary batch-action" disabled={!selectedFiles.length} onClick={() => selectedFiles.forEach(downloadKnowledgeFile)}>
          批量下载
        </button>
        <button className="muted-primary batch-delete" disabled={!selectedFiles.length} onClick={() => deleteKnowledgeFiles(selectedFiles.map((file) => file.id))}>
          批量删除
        </button>
        <button className="sort-select file-status-trigger" onClick={cycleStatusFilter} aria-haspopup="menu">
          {statusFilter} <ChevronDown size={16} />
        </button>
        <div className="table-search">
          <Search size={18} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="输入文件名称或关键词以查询" />
        </div>
      </div>
      <table className="file-table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" checked={allVisibleSelected} onChange={toggleVisibleSelection} /> 文件名称
            </th>
            <th>状态</th>
            <th />
            <th>文件来源</th>
            <th>创建时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {visibleFiles.map((file) => (
            <tr key={file.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedFileIds.includes(file.id)}
                  onChange={() =>
                    setSelectedFileIds((ids) => (ids.includes(file.id) ? ids.filter((id) => id !== file.id) : [...ids, file.id]))
                  }
                />{' '}
                {file.name}
              </td>
              <td>{file.status}</td>
              <td>
                <div className="mini-progress">
                  <i className={file.tone} style={{ width: `${file.progress}%` }} />
                </div>
                {file.progress}%
              </td>
              <td>{file.source}</td>
              <td>{file.created}</td>
              <td>
                <button className="download-link" disabled={file.status === '处理中'} onClick={() => downloadKnowledgeFile(file)}>下载</button>
                <button className="delete-link" onClick={() => deleteKnowledgeFile(file.id)}>删除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!visibleFiles.length && <div className="file-empty-state">未找到匹配的文件</div>}
      <Pagination />
    </section>
  );
}

function AdminView({
  setModal,
  openView,
  templates,
  deleteTemplate
}: {
  setModal: (modal: Modal) => void;
  openView: (view: View) => void;
  templates: TemplateItem[];
  deleteTemplate: (id: string) => void;
}) {
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
        {templates.map((item) => (
          <article className="template-item" key={item.id}>
            <h2>{item.name}</h2>
            <p>{item.prompt}</p>
            <footer>
              {item.creator} ｜ {item.created} ｜ {item.scene}
              <span>
                <Edit3 size={18} />
                <button aria-label="删除模板" onClick={() => deleteTemplate(item.id)}>
                  <Trash2 size={18} />
                </button>
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

function ModalLayer({
  type,
  close,
  setModal,
  toolConfig,
  updateToolConfig,
  styleOptions,
  knowledgeBases,
  createTask,
  createKnowledgeBase,
  uploadKnowledgeFile,
  createTemplate
}: {
  type: Modal;
  close: () => void;
  setModal: (modal: Modal) => void;
  toolConfig: ToolConfig;
  updateToolConfig: (patch: Partial<ToolConfig>) => void;
  styleOptions: string[];
  knowledgeBases: KnowledgeBase[];
  createTask: (patch?: { title?: string; focusArea?: string; frequency?: TaskItem['frequency']; time?: string }) => void;
  createKnowledgeBase: (name: string, desc: string) => void;
  uploadKnowledgeFile: (fileName: string) => void;
  createTemplate: (name: string, prompt: string) => void;
}) {
  return (
    <div
      className={`modal-mask ${type === 'mobileTools' || type === 'mobileScenes' ? 'mobile-sheet-mask' : ''} ${type === 'kbPicker' || type === 'sceneMenu' || type === 'styleMenu' ? 'kb-picker-mask' : ''} ${type === 'frequencyMenu' ? 'frequency-menu-mask' : ''} ${type === 'fileStatusMenu' ? 'file-status-menu-mask' : ''}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      {type === 'kbPicker' && <KbPicker close={close} toolConfig={toolConfig} updateToolConfig={updateToolConfig} knowledgeBases={knowledgeBases} />}
      {type === 'sceneMenu' && <SceneMenu close={close} toolConfig={toolConfig} updateToolConfig={updateToolConfig} />}
      {type === 'styleMenu' && <StyleMenu close={close} toolConfig={toolConfig} updateToolConfig={updateToolConfig} styleOptions={styleOptions} />}
      {type === 'tempFile' && <TempFileModal close={close} toolConfig={toolConfig} updateToolConfig={updateToolConfig} />}
      {type === 'taskConfig' && <TaskConfig close={close} createTask={createTask} />}
      {type === 'frequencyMenu' && <FrequencyMenu close={close} />}
      {type === 'fileStatusMenu' && <FileStatusMenu close={close} />}
      {type === 'createKb' && <CreateKb close={close} createKnowledgeBase={createKnowledgeBase} />}
      {type === 'upload' && <UploadModal close={close} uploadKnowledgeFile={uploadKnowledgeFile} />}
      {type === 'report' && <ReportModal close={close} />}
      {type === 'template' && <TemplateModal close={close} createTemplate={createTemplate} />}
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

function KbPicker({
  close,
  toolConfig,
  updateToolConfig,
  knowledgeBases
}: {
  close: () => void;
  toolConfig: ToolConfig;
  updateToolConfig: (patch: Partial<ToolConfig>) => void;
  knowledgeBases: KnowledgeBase[];
}) {
  const [pendingKbs, setPendingKbs] = useState(toolConfig.selectedKbs);
  const toggleKb = (name: string) => {
    const selected = pendingKbs.includes(name);
    const next = selected ? pendingKbs.filter((item) => item !== name) : [...pendingKbs, name].slice(0, 3);
    setPendingKbs(next);
  };
  const applySelection = () => {
    updateToolConfig({ selectedKbs: pendingKbs });
    close();
  };

  return (
    <section className="modal-panel kb-picker-modal" aria-label="选择知识库">
      <ModalClose close={close} />
      <div className="kb-picker-head">
        <h2>知识库</h2>
        <button className="kb-enable" onClick={applySelection}>
          启用
          <ChevronRight size={14} />
        </button>
      </div>
      <div className="kb-picker-subhead">选择知识库</div>
      <div className="kb-selected-row">
        {pendingKbs.map((item) => (
          <button key={item} onClick={() => toggleKb(item)}>
            {item}
            <X size={14} />
          </button>
        ))}
      </div>
      <div className="inner-search">
        <Search size={17} />
        <input placeholder="搜索知识库名称" />
      </div>
      <div className="kb-option-list">
        {knowledgeBases.length ? knowledgeBases.map((item) => {
          const selected = pendingKbs.includes(item.title);
          return (
          <button key={item.id} className={selected ? 'selected' : ''} onClick={() => toggleKb(item.title)}>
            <span>
              <BookOpen size={16} />
              {item.title}
              <small>{item.files}个文件</small>
            </span>
            <i>{selected ? '✓' : '+'}</i>
          </button>
          );
        }) : <div className="kb-empty">您还没有创建知识库，请先前往知识库管理页面创建</div>}
      </div>
      <small className="kb-picker-tip">最多选择 3 个知识库，选择后会随提问一起参与检索。</small>
      <ModalFooter close={close} confirm="确定" onConfirm={applySelection} />
    </section>
  );
}

function SceneMenu({
  close,
  toolConfig,
  updateToolConfig
}: {
  close: () => void;
  toolConfig: ToolConfig;
  updateToolConfig: (patch: Partial<ToolConfig>) => void;
}) {
  const scenes: Array<{ title: Scene; desc: string; tone: string }> = [
    { title: '技术综述', desc: '全面系统梳理技术领域发展脉络与核心要点。', tone: 'yellow' },
    { title: '方向洞察', desc: '从多源资料提炼机会点、风险与可探索路径。', tone: 'green' },
    { title: '科学传播', desc: '面向传播场景生成清晰、可信、易理解的内容。', tone: 'pink' }
  ];

  return (
    <section className="modal-panel mini-menu scene-menu" aria-label="选择场景">
      <div className="mini-menu-head">场景选择</div>
      {scenes.map((scene) => (
        <button
          key={scene.title}
          className={toolConfig.scene === scene.title ? 'selected' : ''}
          onClick={() => {
            updateToolConfig({ scene: scene.title });
            close();
          }}
        >
          <i className={scene.tone}>
            <Bot size={20} />
          </i>
          <span>
            <strong>{scene.title}</strong>
            <small>{scene.desc}</small>
          </span>
          <em>{toolConfig.scene === scene.title ? '✓' : ''}</em>
        </button>
      ))}
    </section>
  );
}

function StyleMenu({
  close,
  toolConfig,
  updateToolConfig,
  styleOptions
}: {
  close: () => void;
  toolConfig: ToolConfig;
  updateToolConfig: (patch: Partial<ToolConfig>) => void;
  styleOptions: string[];
}) {
  return (
    <section className="modal-panel mini-menu style-menu" aria-label="选择输出风格">
      <div className="mini-menu-head">风格设定</div>
      {styleOptions.map((style) => (
        <button
          key={style}
          className={toolConfig.style === style ? 'selected' : ''}
          onClick={() => {
            updateToolConfig({ style });
            close();
          }}
        >
          <span>
            <strong>{style}</strong>
            <small>{style === '严谨' ? '更适合科研、法规、报告类内容。' : style === '通用' ? '适合大多数问答与探索场景。' : '管理员配置的输出风格模板。'}</small>
          </span>
          <em>{toolConfig.style === style ? '✓' : ''}</em>
        </button>
      ))}
    </section>
  );
}

function TempFileModal({
  close,
  toolConfig,
  updateToolConfig
}: {
  close: () => void;
  toolConfig: ToolConfig;
  updateToolConfig: (patch: Partial<ToolConfig>) => void;
}) {
  const addFile = () => {
    const fileName = `临时资料${toolConfig.tempFiles.length + 1}.pdf`;
    updateToolConfig({ tempFiles: [...toolConfig.tempFiles, fileName] });
  };

  return (
    <section className="modal-panel upload-modal temp-file-modal">
      <ModalClose close={close} />
      <h2>临时文件</h2>
      <div className="drop-zone" onClick={addFile}>
        <Upload size={38} />
        <p>点击上传或拖拽本地文件至此处</p>
        <small>临时文件仅参与当前会话，不写入知识库。</small>
      </div>
      <div className="temp-file-list">
        {(toolConfig.tempFiles.length ? toolConfig.tempFiles : ['麦角硫因稳定性资料.pdf']).map((file) => (
          <span key={file}>{file}</span>
        ))}
      </div>
      <ModalFooter close={close} confirm="完成" muted />
    </section>
  );
}

function TaskConfig({ close, createTask }: { close: () => void; createTask: (patch?: { title?: string; focusArea?: string; frequency?: TaskItem['frequency']; time?: string }) => void }) {
  const [title, setTitle] = useState('');
  const [focusArea, setFocusArea] = useState('');
  const [frequency, setFrequency] = useState<TaskItem['frequency']>('每天');
  const [time, setTime] = useState('0时');

  const submit = () => {
    createTask({ title, focusArea, frequency, time });
    if (focusArea.trim()) close();
  };

  return (
    <section className="modal-panel task-modal">
      <ModalClose close={close} />
      <h2>输入任务名称</h2>
      <input className="task-modal-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="任务名称（选填）" />
      <div className="task-modal-row">
        <RotateCw size={22} />
        <button className="field-select" onClick={() => setFrequency(frequency === '每天' ? '每周' : '每天')}>
          {frequency} <ChevronDown size={17} />
        </button>
        <button className="field-select" onClick={() => setTime(time === '0时' ? '9:00' : '0时')}>
          {time} <ChevronDown size={17} />
        </button>
      </div>
      <p>* 发布频次中设定的时间为任务执行时间，任务执行后需等待几分钟查看结果</p>
      <textarea value={focusArea} onChange={(event) => setFocusArea(event.target.value)} placeholder="在此描述您的关注领域或关注要点" />
      <ModalFooter close={close} confirm="完成" onConfirm={submit} />
    </section>
  );
}

function CreateKb({ close, createKnowledgeBase }: { close: () => void; createKnowledgeBase: (name: string, desc: string) => void }) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  return (
    <section className="modal-panel form-modal">
      <ModalClose close={close} />
      <h2>创建知识库</h2>
      <label>
        <span>* 知识库名称</span>
        <input value={name} onChange={(event) => setName(event.target.value.slice(0, 40))} placeholder="请输入知识库名称,不超过40字符" />
      </label>
      <label>
        <span>描述</span>
        <textarea value={desc} onChange={(event) => setDesc(event.target.value.slice(0, 200))} placeholder="请输入知识库描述信息，不超过200字符" />
      </label>
      <ModalFooter close={close} confirm="创建" muted onConfirm={() => createKnowledgeBase(name, desc)} />
    </section>
  );
}

function UploadModal({ close, uploadKnowledgeFile }: { close: () => void; uploadKnowledgeFile: (fileName: string) => void }) {
  const [fileName, setFileName] = useState('麦角硫因稳定性资料.pdf');

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
      <input className="upload-file-input" value={fileName} onChange={(event) => setFileName(event.target.value)} placeholder="输入模拟上传文件名" />
      <label className="toggle-line">
        <input type="checkbox" defaultChecked /> 多模态解析
      </label>
      <ModalFooter close={close} confirm="上传" muted onConfirm={() => uploadKnowledgeFile(fileName)} />
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

function TemplateModal({ close, createTemplate }: { close: () => void; createTemplate: (name: string, prompt: string) => void }) {
  const [name, setName] = useState('');
  const [prompt, setPrompt] = useState('');

  return (
    <section className="modal-panel template-modal">
      <ModalClose close={close} />
      <h2>新建风格模板</h2>
      <label>
        <span>* 模板名称</span>
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder="请输入风格模板名称，建议简明扼要" />
      </label>
      <label className="scene-row">
        <span>场景选择</span>
        <button className="scene-choice">✓ 科学洞察</button>
      </label>
      <label>
        <span>* 用户提示词</span>
        <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="请输入用户提示词" />
      </label>
      <ModalFooter close={close} confirm="创建" muted onConfirm={() => createTemplate(name, prompt)} />
    </section>
  );
}

function ConfirmModal({ request, close, confirm }: { request: ConfirmRequest; close: () => void; confirm: () => void }) {
  return (
    <div
      className="modal-mask confirm-mask"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <section className="modal-panel confirm-modal" role="dialog" aria-modal="true" aria-label={request.title}>
        <ModalClose close={close} />
        <h2>{request.title}</h2>
        <p>{request.message}</p>
        <ModalFooter close={close} confirm="确认删除" onConfirm={confirm} />
      </section>
    </div>
  );
}

function ModalClose({ close }: { close: () => void }) {
  return (
    <button className="modal-close" aria-label="关闭" onClick={close}>
      <X size={32} />
    </button>
  );
}

function ModalFooter({ close, confirm, muted, onConfirm }: { close: () => void; confirm: string; muted?: boolean; onConfirm?: () => void }) {
  return (
    <footer className="modal-footer">
      <button onClick={close}>取消</button>
      <button className={muted ? 'muted-confirm' : 'confirm'} onClick={onConfirm ?? close}>{confirm}</button>
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

type HuaxiWindow = Window & {
  __huaxiRoot?: ReturnType<typeof createRoot>;
};

const rootElement = document.getElementById('root')!;
const huaxiWindow = window as HuaxiWindow;
const root = huaxiWindow.__huaxiRoot ?? createRoot(rootElement);
huaxiWindow.__huaxiRoot = root;
root.render(<App />);
