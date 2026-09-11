// Khai báo kiểu cho API Form Builder được nền tảng Cogover cung cấp.
// Các ví dụ dùng slug/ID minh họa; thay bằng cấu hình thực tế của layout.

/**
 * Bản ghi dùng cho setData; id phải là ID thực tế. Các field nghiệp vụ có giá trị unknown.
 *
 * @example
 * ```ts
 * const record: FormBuilderRecord = { id: 'record-id', name: 'Sản phẩm', quantity: 2 };
 * list.setData?.([record]);
 * ```
 */
export interface FormBuilderRecord {
    id: string;
    name?: string;
    [key: string]: unknown;
    _canNotViewColumns?: string[];
    _canNotUpdateColumns?: string[];
    _cd?: boolean;
}

/**
 * Thuộc tính chung của trường và thành phần bố cục.
 *
 * @example
 * ```ts
 * const item = screen.get('details', 'GROUP');
 * if (item) item.display = false;
 * ```
 */
export interface BaseScreenItem {
    slug: string;
    display: boolean;
    /**
     * Khôi phục thuộc tính từ màn hình mốc do bạn cung cấp, không tự lấy trạng thái lúc mở form.
     *
     * @example
     * ```ts
     * const before: FormBuilderScreen = { ...screen, formItems: screen.formItems.map((item) => ({ ...item })) };
     * const field = screen.get('quantity');
     * if (field) {
     *     field.readOnly = true;
     *     field.reverse?.(before, 'readOnly');
     * }
     * ```
     */
    reverse?: (prevScreen: FormBuilderScreen, key?: string) => void;
}

/**
 * Trường nhập liệu. Kiểm tra kiểu của value trước khi tính toán.
 *
 * @example
 * ```ts
 * const field = screen.get('quantity');
 * if (field && typeof field.value === 'number') {
 *     field.value += 1;
 *     field.required = true;
 *     field.readOnly = false;
 * }
 * ```
 */
export interface ScreenFormItem extends BaseScreenItem {
    required: boolean;
    readOnly: boolean;
    value: unknown;
    limitedOptions?: string[] | string;
}

/**
 * Hàng, cột, section, nhóm, display box, nút, nhóm nút hoặc tab; không có value.
 *
 * @example
 * ```ts
 * const tab = screen.get('history', 'TAB');
 * if (tab) tab.display = false;
 * ```
 */
export type ScreenContainer = BaseScreenItem;

/**
 * Path Component: điều khiển hiển thị và chặn lưu theo giai đoạn.
 *
 * @example
 * ```ts
 * const path = screen.get('order_stage', 'PATH_COMPONENT');
 * if (path) {
 *     path.submitBlocked = false; // true chặn mọi giai đoạn
 *     path.submitBlockedStages = ['stage-closed-id'];
 * }
 * ```
 */
export interface ScreenPathComponent extends BaseScreenItem {
    submitBlocked?: boolean;
    submitBlockedStages?: string[];
}

/**
 * Bảng liên quan. Các hàm tùy chọn phụ thuộc khả năng host cung cấp.
 *
 * @example
 * ```ts
 * const list = screen.get('order_products', 'RELATED_LIST');
 * if (list?.rows) {
 *     for (const row of await list.rows()) {
 *         const cell = row.get('discount_percent');
 *         if (cell) cell.value = 10;
 *     }
 * }
 * ```
 */
export interface ScreenRelatedList extends BaseScreenItem {
    creatableNewRecord: boolean;
    readOnly: boolean;
    /**
     * Đặt dữ liệu bảng; trả false nếu chưa áp dụng được. Không đồng nghĩa đã lưu lên server.
     *
     * @example
     * ```ts
     * if (list.setData && !list.setData([{ id: 'record-id', quantity: 2 }])) {
     *     throw new Error('Chưa áp dụng được dữ liệu.');
     * }
     * ```
     */
    setData?: (records: FormBuilderRecord[]) => boolean;
    /**
     * Đợi bảng sẵn sàng và lấy các dòng. Gọi trong callback async.
     *
     * @example
     * ```ts
     * for (const row of await list.rows?.() ?? []) {
     *     const cell = row.get('quantity');
     *     if (cell) cell.value = 2;
     * }
     * ```
     */
    rows?: () => Promise<ScreenRelatedListRow[]>;
    /**
     * Lấy dòng theo vị trí bắt đầu từ 0; có thể trả null.
     *
     * @example
     * ```ts
     * const firstRow = await list.row?.(0);
     * ```
     */
    row?: (rowIndex: number) => Promise<ScreenRelatedListRow | null>;
    /**
     * Cách gọi khác của row, lấy dòng theo vị trí.
     *
     * @example
     * ```ts
     * const firstRow = await list.getRow?.(0);
     * ```
     */
    getRow?: (rowIndex: number) => Promise<ScreenRelatedListRow | null>;
    /**
     * Lấy đối tượng thao tác cột theo slug của field.
     *
     * @example
     * ```ts
     * const column = await list.getCol?.('quantity');
     * if (column) column.required = true;
     * ```
     */
    getCol?: (fieldSlug: string) => Promise<ScreenRelatedListColumn | null>;
    /**
     * Tìm dòng theo điều kiện; có thể trả null.
     *
     * @example
     * ```ts
     * const row = await list.findRow?.((item) => item.recordId === 'record-id');
     * ```
     */
    findRow?: (predicate: (row: ScreenRelatedListRow) => boolean) => Promise<ScreenRelatedListRow | null>;
    /**
     * Lưu bảng liên quan, không phải toàn bộ form cha. Chỉ gọi khi người dùng yêu cầu lưu.
     *
     * @example
     * ```ts
     * if (!list.submit) throw new Error('Bảng chưa hỗ trợ lưu.');
     * await list.submit();
     * ```
     */
    submit?: () => Promise<void>;
}

/**
 * Dòng trong bảng liên quan, định danh bằng recordId và vị trí rowIndex.
 *
 * @example
 * ```ts
 * const row = await list.row?.(0);
 * if (row) {
 *     row.readOnly = false;
 *     const cell = row.get('quantity');
 *     if (cell) cell.value = 2;
 * }
 * ```
 */
export interface ScreenRelatedListRow {
    rowIndex: number;
    recordId: string;
    readOnly: boolean;
    required: boolean;
    /**
     * Lấy ô của dòng theo slug của field; trả null khi không lấy được ô.
     *
     * @example
     * ```ts
     * const cell = row.get('quantity');
     * if (cell && typeof cell.value === 'number') cell.value += 1;
     * ```
     */
    get: (fieldSlug: string) => ScreenRelatedListCell | null;
}

/**
 * Cột trong bảng. Gán value tác động toàn bộ dòng của cột; không có display.
 *
 * @example
 * ```ts
 * const column = await list.getCol?.('discount_percent');
 * if (column) {
 *     column.readOnly = true;
 *     column.required = false;
 * }
 * ```
 */
export interface ScreenRelatedListColumn {
    slug: string;
    value: unknown;
    readOnly: boolean;
    required: boolean;
}

/**
 * Ô trong bảng. Gán value cập nhật qua API bảng ngay; không tự hoàn tác nếu script lỗi. Không có display.
 *
 * @example
 * ```ts
 * const cell = row.get('status');
 * if (cell) {
 *     cell.required = true;
 *     cell.limitedOptions = ['option-draft-id'];
 *     cell.displayHtml = '<strong>Trạng thái</strong>'; // HTML cố định, đáng tin cậy
 * }
 * ```
 */
export interface ScreenRelatedListCell {
    slug: string;
    value: unknown;
    readOnly: boolean;
    required: boolean;
    limitedOptions?: string[] | string;
    displayHtml?: string;
}

/**
 * Dữ liệu màn hình và các hành động do host cung cấp. Dùng FormBuilderScriptScreen khi cần get().
 *
 * @example
 * ```ts
 * const visibleFields = screen.formItems.filter((field) => field.display);
 * const tabSlugs = (screen.tabs ?? []).map((tab) => tab.slug);
 * ```
 */
export interface FormBuilderScreen {
    formItems: ScreenFormItem[];
    rows: ScreenContainer[];
    columns: ScreenContainer[];
    groups: ScreenContainer[];
    displayBoxes: ScreenContainer[];
    sections: ScreenContainer[];
    buttons: ScreenContainer[];
    buttonGroups: ScreenContainer[];
    relatedLists: ScreenRelatedList[];
    pathComponents: ScreenPathComponent[];
    tabs?: ScreenContainer[];
    /**
     * Chuyển layout theo ID. Trả void, không dùng await để chờ hoàn tất chuyển màn hình.
     *
     * @example
     * ```ts
     * screen.changeLayout('target-layout-id');
     * ```
     */
    changeLayout: (layoutId: string) => void;
    /**
     * Kích hoạt nút cấu hình trên layout. Trả void, không chờ kết quả hành động của nút.
     *
     * @example
     * ```ts
     * screen.triggerButton('save_button', true);
     * ```
     */
    triggerButton: (buttonSlug: string, required?: boolean) => void;
}

/**
 * Màn hình trong callback execScript, bổ sung get(). Không giữ screen để sửa sau khi callback kết thúc.
 *
 * @example
 * ```ts
 * await formBuilder.execScript?.(({ screen }) => {
 *     const field = screen.get('required_short_text');
 *     if (field) field.value = 'Test 123';
 * });
 * ```
 */
export interface FormBuilderScriptScreen extends FormBuilderScreen {
    /**
     * Lấy trường nhập liệu theo slug; trả null nếu không tìm thấy.
     *
     * @example
     * ```ts
     * const field = screen.get('name');
     * if (field) field.value = 'Test';
     * ```
     */
    get(slug: string, componentType?: 'FORM_ITEM'): ScreenFormItem | null;
    /**
     * Lấy danh sách liên quan theo slug; trả null nếu không tìm thấy.
     *
     * @example
     * ```ts
     * const list = screen.get('order_products', 'RELATED_LIST');
     * const rows = await list?.rows?.();
     * ```
     */
    get(slug: string, componentType: 'RELATED_LIST'): ScreenRelatedList | null;
    /**
     * Lấy Path Component theo slug; trả null nếu không tìm thấy.
     *
     * @example
     * ```ts
     * const path = screen.get('order_stage', 'PATH_COMPONENT');
     * if (path) path.submitBlocked = true;
     * ```
     */
    get(slug: string, componentType: 'PATH_COMPONENT'): ScreenPathComponent | null;
    /**
     * Lấy hàng, cột, nhóm, section, display box, nút, nhóm nút hoặc tab theo slug.
     *
     * @example
     * ```ts
     * const group = screen.get('details', 'GROUP');
     * if (group) group.display = false;
     * ```
     */
    get(
        slug: string,
        componentType: 'ROW' | 'COLUMN' | 'SECTION' | 'GROUP' | 'DISPLAY_BOX' | 'BUTTON' | 'BUTTON_GROUP' | 'TAB',
    ): ScreenContainer | null;
}

/**
 * Ngữ cảnh của callback execScript. Hiện host truyền screen; không cung cấp initScreen trong callback.
 *
 * @example
 * ```ts
 * const script = ({ screen }: FormBuilderScriptContext): void => {
 *     const group = screen.get('details', 'GROUP');
 *     if (group) group.display = true;
 * };
 * ```
 */
export interface FormBuilderScriptContext {
    screen: FormBuilderScriptScreen;
}

/**
 * Chuỗi script cũ hoặc hàm đồng bộ/bất đồng bộ. Ưu tiên hàm để được kiểm tra kiểu và dùng biến bên ngoài.
 *
 * @example
 * ```ts
 * const discountPercent = 15;
 * const script: FormBuilderScript = async ({ screen }) => {
 *     const list = screen.get('order_products', 'RELATED_LIST');
 *     for (const row of await list?.rows?.() ?? []) {
 *         const cell = row.get('discount_percent');
 *         if (cell) cell.value = discountPercent;
 *     }
 * };
 * await formBuilder.execScript?.(script);
 * ```
 */
export type FormBuilderScript = string | ((context: FormBuilderScriptContext) => void | Promise<void>);

/**
 * API Form Builder nhận từ host. execScript có thể chưa được cung cấp.
 *
 * @example
 * ```ts
 * async function apply(formBuilder: FormBuilderApi): Promise<void> {
 *     if (!formBuilder.execScript) throw new Error('Form Builder chưa sẵn sàng.');
 *     await formBuilder.execScript(({ screen }) => {
 *         const field = screen.get('name');
 *         if (field) field.value = 'Test';
 *     });
 * }
 * ```
 */
export interface FormBuilderApi {
    /**
     * Chạy script từ sự kiện người dùng. Await trước khi báo thành công; bắt lỗi tại component.
     * Không đồng nghĩa đã lưu form lên server.
     *
     * @example
     * ```ts
     * if (!formBuilder.execScript) throw new Error('Form Builder chưa sẵn sàng.');
     * await formBuilder.execScript(({ screen }) => {
     *     const field = screen.get('required_short_text');
     *     if (field) field.value = 'Test 123';
     * });
     * ```
     */
    execScript?: (script: FormBuilderScript) => Promise<void>;
}

/**
 * Props nền tảng Cogover truyền cho component nhúng; chỉ dùng import type.
 *
 * @example
 * ```ts
 * function Demo({ formBuilder }: FormBuilderComponentProps) {
 *     const handleClick = async () => {
 *         if (!formBuilder?.execScript) return;
 *         await formBuilder.execScript(({ screen }) => {
 *             const field = screen.get('name');
 *             if (field) field.value = 'Test';
 *         });
 *     };
 *     // Gắn handleClick vào nút; không gọi khi render.
 * }
 * ```
 */
export interface FormBuilderComponentProps {
    formBuilder?: FormBuilderApi;
}
