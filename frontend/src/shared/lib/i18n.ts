import { create } from 'zustand';

export type Locale = 'ko' | 'en' | 'ja';

const LOCALES: Locale[] = ['ko', 'en', 'ja'];

const dict = {
  header: {
    todos: { ko: '할일 목록', en: 'Todos', ja: 'タスク一覧' },
    myPage: { ko: '마이페이지', en: 'My Page', ja: 'マイページ' },
    logout: { ko: '로그아웃', en: 'Log out', ja: 'ログアウト' },
    toggleTheme: { ko: '테마 전환', en: 'Toggle theme', ja: 'テーマ切替' },
    menu: { ko: '메뉴', en: 'Menu', ja: 'メニュー' },
  },
  signup: {
    title: { ko: '회원가입', en: 'Sign up', ja: '会員登録' },
    email: { ko: '이메일', en: 'Email', ja: 'メールアドレス' },
    password: { ko: '비밀번호 (8자 이상)', en: 'Password (8+ characters)', ja: 'パスワード（8文字以上）' },
    name: { ko: '이름', en: 'Name', ja: '名前' },
    submit: { ko: '가입하기', en: 'Sign up', ja: '登録する' },
    hasAccount: { ko: '이미 계정이 있으신가요?', en: 'Already have an account?', ja: 'すでにアカウントをお持ちですか？' },
    loginLink: { ko: '로그인', en: 'Log in', ja: 'ログイン' },
    invalidEmail: { ko: '올바른 이메일 형식이 아닙니다.', en: 'Please enter a valid email address.', ja: '正しいメール形式ではありません。' },
    invalidPassword: { ko: '비밀번호는 8자 이상이어야 합니다.', en: 'Password must be at least 8 characters.', ja: 'パスワードは8文字以上で入力してください。' },
    passwordConfirm: { ko: '비밀번호 확인', en: 'Confirm password', ja: 'パスワード確認' },
    passwordMismatch: { ko: '비밀번호가 일치하지 않습니다.', en: 'Passwords do not match.', ja: 'パスワードが一致しません。' },
  },
  login: {
    title: { ko: '로그인', en: 'Log in', ja: 'ログイン' },
    email: { ko: '이메일', en: 'Email', ja: 'メールアドレス' },
    password: { ko: '비밀번호', en: 'Password', ja: 'パスワード' },
    submit: { ko: '로그인', en: 'Log in', ja: 'ログイン' },
    noAccount: { ko: '계정이 없으신가요?', en: "Don't have an account?", ja: 'アカウントをお持ちでないですか？' },
    signupLink: { ko: '회원가입', en: 'Sign up', ja: '会員登録' },
  },
  myPage: {
    title: { ko: '마이페이지', en: 'My Page', ja: 'マイページ' },
    email: { ko: '이메일', en: 'Email', ja: 'メールアドレス' },
    emailReadonly: { ko: '이메일은 수정할 수 없습니다.', en: 'Email cannot be changed.', ja: 'メールアドレスは変更できません。' },
    name: { ko: '이름', en: 'Name', ja: '名前' },
    save: { ko: '저장', en: 'Save', ja: '保存' },
    saved: { ko: '✔ 변경 사항이 저장되었습니다.', en: '✔ Changes saved.', ja: '✔ 変更内容が保存されました。' },
  },
  todoList: {
    allCategories: { ko: '전체 카테고리', en: 'All categories', ja: '全カテゴリー' },
    allStatuses: { ko: '전체 상태', en: 'All statuses', ja: '全ステータス' },
    manageCategories: { ko: '카테고리 관리', en: 'Manage categories', ja: 'カテゴリー管理' },
    addTodo: { ko: '할일 등록', en: 'Add todo', ja: 'タスク追加' },
    empty: { ko: '표시할 할일이 없습니다.', en: 'No todos to display.', ja: '表示する項目がありません。' },
    loading: { ko: '불러오는 중...', en: 'Loading...', ja: '読み込み中...' },
    delete: { ko: '삭제', en: 'Delete', ja: '削除' },
  },
  todoForm: {
    createTitle: { ko: '할일 등록', en: 'Add Todo', ja: 'タスク登録' },
    editTitle: { ko: '할일 수정', en: 'Edit Todo', ja: 'タスク編集' },
    fieldTitle: { ko: '제목', en: 'Title', ja: 'タイトル' },
    startDate: { ko: '시작일자', en: 'Start date', ja: '開始日' },
    endDate: { ko: '종료일자', en: 'End date', ja: '終了日' },
    category: { ko: '카테고리', en: 'Category', ja: 'カテゴリー' },
    categoryNone: { ko: '선택 안 함', en: 'None', ja: '未選択' },
    categoryDefaultSuffix: { ko: '(기본)', en: '(default)', ja: '（デフォルト）' },
    categoryHint: {
      ko: "미선택 시 '기본' 카테고리가 자동 적용됩니다.",
      en: "If left unselected, the 'Default' category will be applied automatically.",
      ja: '未選択の場合は「デフォルト」カテゴリーが自動的に適用されます。',
    },
    markDone: { ko: '완료로 표시', en: 'Mark as done', ja: '完了にする' },
    save: { ko: '저장', en: 'Save', ja: '保存' },
    delete: { ko: '삭제', en: 'Delete', ja: '削除' },
    dateRangeError: {
      ko: '종료일자는 시작일자보다 빠를 수 없습니다.',
      en: 'End date cannot be earlier than start date.',
      ja: '終了日は開始日より前に設定できません。',
    },
    notFound: { ko: '할일을 찾을 수 없습니다.', en: 'Todo not found.', ja: 'タスクが見つかりません。' },
  },
  category: {
    title: { ko: '카테고리 관리', en: 'Manage Categories', ja: 'カテゴリー管理' },
    namePlaceholder: { ko: '새 카테고리 이름', en: 'New category name', ja: '新しいカテゴリー名' },
    add: { ko: '추가', en: 'Add', ja: '追加' },
    delete: { ko: '삭제', en: 'Delete', ja: '削除' },
    close: { ko: '닫기', en: 'Close', ja: '閉じる' },
    deleteConfirmTitle: { ko: '정말 삭제하시겠습니까?', en: 'Are you sure you want to delete this?', ja: '本当に削除しますか？' },
    deleteConfirmMessage: {
      ko: (name: string) => `'${name}' 삭제 시 소속 할일은 기본 카테고리로 이관됩니다.`,
      en: (name: string) => `Deleting '${name}' will move its todos to the default category.`,
      ja: (name: string) => `「${name}」を削除すると、含まれるタスクはデフォルトカテゴリーに移動されます。`,
    },
  },
  confirm: {
    cancel: { ko: '취소', en: 'Cancel', ja: 'キャンセル' },
    delete: { ko: '삭제', en: 'Delete', ja: '削除' },
    deleteTitle: { ko: '정말 삭제하시겠습니까?', en: 'Are you sure you want to delete this?', ja: '本当に削除しますか？' },
    deleteMessage: { ko: '이 작업은 되돌릴 수 없습니다.', en: 'This action cannot be undone.', ja: 'この操作は元に戻せません。' },
  },
  status: {
    시작전: { ko: '시작전', en: 'Upcoming', ja: '開始前' },
    진행중: { ko: '진행중', en: 'In progress', ja: '進行中' },
    완료: { ko: '완료', en: 'Done', ja: '完了' },
    기한초과: { ko: '기한초과', en: 'Overdue', ja: '期限超過' },
  },
  errorCode: {
    CONFLICT: { ko: '이미 등록된 이메일입니다.', en: 'This email is already registered.', ja: 'すでに登録されているメールアドレスです。' },
    INVALID_CREDENTIALS: {
      ko: '이메일 또는 비밀번호가 올바르지 않습니다.',
      en: 'Incorrect email or password.',
      ja: 'メールアドレスまたはパスワードが正しくありません。',
    },
    CATEGORY_NAME_ALREADY_EXISTS: { ko: '이미 존재하는 카테고리명입니다.', en: 'This category name already exists.', ja: 'すでに存在するカテゴリー名です。' },
    DEFAULT_CATEGORY_DELETE_FORBIDDEN: {
      ko: '기본 카테고리는 삭제할 수 없습니다.',
      en: 'The default category cannot be deleted.',
      ja: 'デフォルトカテゴリーは削除できません。',
    },
    FORBIDDEN: { ko: '리소스에 대한 권한이 없습니다.', en: 'You do not have permission for this resource.', ja: 'このリソースへの権限がありません。' },
    NOT_FOUND: { ko: '찾을 수 없습니다.', en: 'Not found.', ja: '見つかりません。' },
    UNAUTHORIZED: { ko: '다시 로그인해 주세요.', en: 'Please log in again.', ja: '再度ログインしてください。' },
    INVALID_REFRESH_TOKEN: { ko: '다시 로그인해 주세요.', en: 'Please log in again.', ja: '再度ログインしてください。' },
  },
};

type Dict = typeof dict;
type TranslationValue = Record<Locale, string> | Record<Locale, (...args: string[]) => string>;

function getInitialLocale(): Locale {
  const stored = localStorage.getItem('locale');
  if (stored === 'ko' || stored === 'en' || stored === 'ja') return stored;
  const browser = navigator.language.slice(0, 2);
  return LOCALES.includes(browser as Locale) ? (browser as Locale) : 'ko';
}

interface I18nState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useI18nStore = create<I18nState>((set) => ({
  locale: getInitialLocale(),
  setLocale: (locale) => {
    localStorage.setItem('locale', locale);
    if (import.meta.env.DEV) console.log('[i18n] locale changed', locale);
    set({ locale });
  },
}));

export function translate<S extends keyof Dict, K extends keyof Dict[S]>(
  locale: Locale,
  section: S,
  key: K,
  ...args: string[]
): string {
  const entry = (dict[section][key] as TranslationValue)[locale];
  return typeof entry === 'function' ? entry(...args) : entry;
}

/** Falls back to the raw server message when the error code has no translation entry. */
export function translateErrorCode(locale: Locale, code: string, fallbackMessage: string): string {
  const entry = (dict.errorCode as Record<string, Record<Locale, string> | undefined>)[code];
  return entry ? entry[locale] : fallbackMessage;
}

export function useTranslation() {
  const locale = useI18nStore((s) => s.locale);
  return {
    locale,
    t: <S extends keyof Dict, K extends keyof Dict[S]>(section: S, key: K, ...args: string[]) =>
      translate(locale, section, key, ...args),
    tError: (code: string, fallbackMessage: string) => translateErrorCode(locale, code, fallbackMessage),
  };
}
