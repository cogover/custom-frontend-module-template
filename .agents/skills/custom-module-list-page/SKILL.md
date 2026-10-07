---
name: custom-module-list-page
description: Use when creating or changing a list page (màn danh sách, trang danh sách, bảng dữ liệu) in custom-module-template - ListViewTable header with total count, settings and create buttons, table columns and cells, row action menu, pagination, resizable right filter panel (ResizableMenu), or page height and scrolling.
---

# Custom Module List Page

Màn danh sách của custom module phải giống màn danh sách của Cogover (ví dụ Cài đặt → Quản lý đối tượng). Trước khi code, dùng Read để xem ảnh mẫu [`assets/list-page-reference.jpg`](assets/list-page-reference.jpg) và đối chiếu lại khi kiểm tra.

Mọi khối của màn danh sách đã có sẵn trong `@cogover/client-sdk/ui`, lấy từ đúng code của Cogover. **Không tự viết `<table>`, phân trang, thanh kéo panel hay dropdown.** Props chi tiết xem README của package (`node_modules/@cogover/client-sdk/README.md`).

| Vùng         | Component SDK                                                                             |
| ------------ | ----------------------------------------------------------------------------------------- |
| Header       | `ListViewTable` (`title`, `renderActionButtons`) + `PopperButton` + `GroupDropdownButton` |
| Cấu hình cột | `TableSettings` + `useTableV2` + `useSaveTableSetting` (template)                         |
| Bảng         | `ListViewTable` (bên trong là `TableV2`)                                                  |
| Phân trang   | prop `pagination` của `ListViewTable` (component `Pagination`)                            |
| Panel lọc    | `ResizableMenu` + `MultipleSelect` chọn trường lọc + `TextField` tìm kiếm + `FormItem`    |

## 1. Bố cục trang

```tsx
import type { CSSProperties } from 'react';
import { useAppSlug } from 'src/providers/appSlugContext';
import cx from 'src/utils/cx';

// Standalone không có thanh công cụ của Cogover; khi nhúng, biến này do Cogover đặt (56px).
const STANDALONE_LAYOUT_VARS = { '--top-toolbar-width': '0px' } as CSSProperties;

export default function PromotionProgramListPage() {
    const appSlug = useAppSlug();

    return (
        <div
            className={cx('flex h-[calc(100svh-var(--top-toolbar-width))] bg-background-default')}
            style={appSlug ? undefined : STANDALONE_LAYOUT_VARS}
        >
            <div className={cx('flex w-0 flex-1 flex-col px-[1.5rem] py-[1rem]')}>
                <ProgramTable /> {/* ListViewTable className='flex-1 h-0' — mục 2 */}
            </div>
            <ProgramFilterMenu /> {/* ResizableMenu — mục 5 */}
        </div>
    );
}
```

Rules:

1. Cả trang không cuộn; `ListViewTable` tự cuộn bảng, panel lọc tự cuộn nội dung. Phân trang luôn nằm trong khung nhìn.
2. Không chèn thẻ số liệu (KPI), banner hay tab giữa header và bảng khi user không yêu cầu rõ.
3. Không đặt ô tìm kiếm hoặc nút “Bộ lọc” trên header; không dùng `Drawer`/`Modal` cho bộ lọc.

## 2. Bảng, header và cấu hình cột: `TableSettings` + `ListViewTable`

```tsx
import {
    Button,
    ColumnsIcon,
    DownloadIcon,
    GroupDropdownButton,
    InfoCircleIcon,
    ListViewTable,
    PlusIcon,
    PopperButton,
    PopperMenuItem,
    SlidersIcon,
    TableSettings,
    Tooltip,
    useTableV2,
    type ColumnType,
} from '@cogover/client-sdk/ui';
import { useSaveTableSetting } from 'src/hooks/useSaveTableSetting';
import { TABLE_PAGE_SIZE_OPTIONS } from 'src/utils/constant/table';

const TABLE_NAME = 'promotion_program';

function ProgramTable() {
    const initColumns = useProgramColumns(); // mục "Cột" bên dưới
    const {
        columns,
        setColumns,
        showingColumns,
        setShowingColumns,
        pinnedColumns,
        setPinnedColumns,
        sortBy,
        setSortBy,
        sortDir,
        setSortDir,
        page,
        setPage,
        limit,
        setLimit,
    } = useTableV2<PromotionProgram>({
        tableName: TABLE_NAME,
        initColumns,
        initPinnedColumns: { left: ['name'], right: ['action'] },
    });
    const saveTableSetting = useSaveTableSetting<PromotionProgram>(TABLE_NAME);
    const { data, isPending } = usePrograms({ ...filters, page, limit, sortBy, sortDir }); // dữ liệu theo skill custom-module-api
    const rows = data?.rows ?? [];
    const total = data?.total ?? 0;

    return (
        <TableSettings
            dataKey='id'
            settings={{ columns, pinnedColumns, showingColumns }}
            onChangeSettings={{
                columns: setColumns,
                pinnedColumns: setPinnedColumns,
                showingColumns: setShowingColumns,
            }}
            onConfirm={saveTableSetting}
        >
            {({ showSettings, onResizeColumn, onResizeWidth, onChangeSelect, onChangeSelectAll }) => (
                <ListViewTable
                    className={cx('h-0 flex-1')}
                    title={
                        <div className={cx('inline-flex items-center gap-[0.25rem]')}>
                            <h6 className={cx('prose-h6 text-typo-primary')}>
                                Chương trình ưu đãi {total > 0 && `(${formatNumber(total)})`}
                            </h6>
                            <Tooltip content='Danh sách chương trình ưu đãi của cửa hàng.'>
                                <span className={cx('inline-flex text-typo-secondary')}>
                                    <InfoCircleIcon fontSize={14} />
                                </span>
                            </Tooltip>
                        </div>
                    }
                    renderActionButtons={() => (
                        <div className={cx('flex gap-[0.5rem]')}>
                            <PopperButton
                                variant='gray'
                                startIcon={<SlidersIcon fontSize={12} />}
                                render={() => (
                                    <>
                                        <PopperMenuItem className='hide-on-click' onClick={exportData}>
                                            <DownloadIcon /> Xuất dữ liệu
                                        </PopperMenuItem>
                                        <PopperMenuItem className='hide-on-click' onClick={showSettings}>
                                            <ColumnsIcon /> Cấu hình cột
                                        </PopperMenuItem>
                                    </>
                                )}
                            >
                                Cài đặt
                            </PopperButton>
                            <GroupDropdownButton
                                outerButton={
                                    <Button className='rounded-r-none' startIcon={<PlusIcon />} onClick={createQuick}>
                                        Tạo
                                    </Button>
                                }
                                innerButton={
                                    <>
                                        <PopperMenuItem className='hide-on-click' onClick={createManual}>
                                            Tạo thủ công
                                        </PopperMenuItem>
                                        <PopperMenuItem className='hide-on-click' onClick={importExcel}>
                                            Tạo nhanh từ file Excel
                                        </PopperMenuItem>
                                    </>
                                }
                            />
                        </div>
                    )}
                    renderNoData={() => (
                        <h5 className={cx('mt-[1.25rem] prose-h5 text-typo-secondary')}>Không tìm thấy chương trình</h5>
                    )}
                    tableClassName={cx({ 'h-full': rows.length !== 0 })}
                    dataKey='id'
                    dataSource={rows}
                    loading={isPending}
                    columns={columns}
                    pinnedColumns={pinnedColumns}
                    showingColumns={showingColumns}
                    columnResizable
                    stickyHeader
                    onResizeColumn={onResizeColumn}
                    onResizeWidth={onResizeWidth}
                    onChangeSelect={onChangeSelect}
                    onChangeSelectAll={onChangeSelectAll}
                    sortBy={sortBy}
                    sortDir={sortDir}
                    onSortChange={(by, dir) => {
                        setSortBy(by);
                        setSortDir(dir);
                        setPage(1);
                    }}
                    pagination={{
                        currentPage: page,
                        total,
                        perPage: limit,
                        perPageOptions: TABLE_PAGE_SIZE_OPTIONS,
                        onNextPage: () => setPage((prev) => prev + 1),
                        onPrevPage: () => setPage((prev) => prev - 1),
                        onChangePerPage: (size) => {
                            setPage(1);
                            setLimit(size);
                        },
                    }}
                />
            )}
        </TableSettings>
    );
}
```

Rules:

1. Header luôn có: tiêu đề `prose-h6` kèm tổng số (chỉ hiện khi `total > 0`, không hiện “(0)” lúc đang tải), ⓘ (`Tooltip` + `InfoCircleIcon`), nút **Cài đặt** (`PopperButton variant='gray'`, menu Xuất dữ liệu / Cấu hình cột) và nút tạo tách menu (`GroupDropdownButton`, menu Tạo thủ công / Tạo nhanh từ file Excel).
2. “Cấu hình cột” gọi `showSettings` của `TableSettings`; lưu bằng `useSaveTableSetting(tableName)` của template (truyền thẳng vào `onConfirm`). State cột, sắp xếp, trang và số dòng lấy từ `useTableV2`, không tự giữ bằng `useState`.
3. Mục menu có class `hide-on-click` để tự đóng menu sau khi bấm.
4. Không thêm nút làm mới; dữ liệu tự cập nhật qua TanStack Query.
5. Không tự render bảng, skeleton, trạng thái trống hay phân trang; truyền qua props của `ListViewTable`. Bảng tự ẩn phân trang khi `total` không vượt số dòng nhỏ nhất.
6. Đổi bộ lọc, sắp xếp hoặc số dòng thì về trang 1.

### Cột

```tsx
function useProgramColumns() {
    return useMemo<ColumnType<PromotionProgram>[]>(
        () => [
            {
                key: 'name',
                label: 'Tên chương trình',
                width: 240,
                minWidth: 120,
                sortable: true,
                render: (program) => (
                    <Link
                        to={`/promotion-programs/${program.id}`}
                        className={cx('block truncate prose-body2 font-medium text-primary-main hover:underline')}
                    >
                        {program.name}
                    </Link>
                ),
            },
            {
                key: 'status',
                label: 'Trạng thái',
                width: 160,
                minWidth: 120,
                sortable: true,
                render: (program) => <ProgramStatus status={program.status} />,
            },
            {
                key: 'action',
                label: '',
                settingLabel: 'Thao tác',
                width: 40,
                minWidth: 40,
                paddingX: 0,
                canHide: false,
                render: (program) => <RowActionMenu program={program} />, // mục 4
            },
        ],
        [],
    );
}
```

1. Cột đầu là trường hiển thị chính của bản ghi (thường là tên) dạng `Link` nội bộ, ghim trái. Mã bản ghi đặt ở cột sau.
2. Độ rộng mặc định khoảng `175` (`minWidth: 120`); cột thao tác `key: 'action'`, `label: ''`, `settingLabel: 'Thao tác'` (tên trong hộp Cấu hình cột), `width/minWidth: 40`, `paddingX: 0`, ghim phải.
3. Nội dung ô một dòng: bọc chữ trong `div` có `truncate`, không để chữ xuống dòng.
4. Link tới trang chi tiết dùng path tuyệt đối tính từ gốc module (`/promotion-programs/${id}`). Path tương đối như `promotion-programs/${id}` sẽ nối vào route hiện tại, standalone ra `/promotion-programs/promotion-programs/…`.

## 3. Hiển thị giá trị theo kiểu trường

| Kiểu                                  | Cách hiển thị                                                                                                                  |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Trạng thái, lựa chọn có màu           | Chấm `size-[0.5rem] rounded-full bg-[currentColor]` + chữ, cả hai cùng một màu chữ (bảng màu bên dưới). Không dùng pill có nền |
| Lựa chọn không màu (loại, điều kiện…) | Chữ thường `text-typo-primary`                                                                                                 |
| Mã, slug, giá trị kỹ thuật            | `<Tag variant='gray' rounded className={cx('w-fit prose-caption1')}>`                                                          |
| Người                                 | `Avatar` (`src/components/Avatar`, `size={24}`) + tên, cách `0.5rem`, `truncate`                                               |
| Ngày giờ                              | `dayjs(value).format(dateTimeFormat)` với `useListDateTimeFormat()`, màu `text-typo-secondary`                                 |
| Khoảng ngày                           | `từ → đến` một dòng theo `dateFormat` của `useListDateTimeFormat()`; thiếu ngày kết thúc thì ghi “Không giới hạn”              |
| Số                                    | `align: 'right'` trong cột, `tabular-nums`, `Intl.NumberFormat('vi-VN')`                                                       |
| Không có giá trị                      | Để trống ô                                                                                                                     |

Màu trạng thái theo ý nghĩa: đang chạy, hoạt động → `text-success`; tạm dừng, chờ → `text-orange2-600`; lỗi, huỷ, từ chối → `text-error`; mới, đang xử lý → `text-info`; nháp, kết thúc, ngừng → `text-typo-secondary`.

```tsx
import dayjs from 'dayjs';
import { useListDateTimeFormat } from 'src/hooks/useListDateTimeFormat';

const { dateTimeFormat } = useListDateTimeFormat(); // vd 'DD/MM/YYYY, HH:mm:ss'
<span className={cx('text-typo-secondary')}>
    {program.createdAt ? dayjs(program.createdAt).format(dateTimeFormat) : null}
</span>;
```

Không viết cứng định dạng ngày giờ (`npm run lint` chặn). Không đọc trực tiếp `workspace.dateFormat`/`timeFormat` để format: đây là mã số của workspace, dùng `useListDateTimeFormat()`. Timestamp mili-giây hoặc chuỗi ISO dùng `dayjs(value)`; không đưa timestamp mili-giây vào `formatDateTime` của `src/utils/timeUtils` (hàm đó coi số là giây).

## 4. Menu thao tác dòng

```tsx
import {
    CopyIcon,
    EllipsisVerticalIcon,
    EyeIcon,
    PauseCircleIcon,
    PopperButton,
    PopperMenu,
    PopperMenuItem,
    StopCircleIcon,
} from '@cogover/client-sdk/ui';

function RowActionMenu({ program, onAction }: RowActionMenuProps) {
    return (
        <div className={cx('flex')}>
            <PopperButton
                ariaLabel='Thao tác'
                render={() => (
                    <PopperMenu>
                        <PopperMenuItem className='hide-on-click' onClick={() => onAction('view', program)}>
                            <EyeIcon className={cx('mr-[0.75rem]')} fontSize={15} />
                            <p className={cx('prose-body2')}>Xem chi tiết</p>
                        </PopperMenuItem>
                        {/* Nhân bản: CopyIcon · Tạm dừng: PauseCircleIcon · Kết thúc: StopCircleIcon, đặt cuối */}
                    </PopperMenu>
                )}
            >
                <EllipsisVerticalIcon className={cx('text-typo-secondary')} />
            </PopperButton>
        </div>
    );
}
```

Rules:

1. `PopperButton` không truyền `startIcon` sẽ render `IconButton` (⋮ dọc), luôn truyền `ariaLabel='Thao tác'` cho nút chỉ có icon. Không tự dựng dropdown bằng `div` định vị tuyệt đối.
2. Mục chỉ hợp lệ theo trạng thái (vd Tạm dừng khi đang chạy) thì ẩn khi không hợp lệ.
3. Thao tác không hoàn tác được (kết thúc, xoá) đặt cuối menu và hỏi lại bằng `ConfirmModal`: `message` là ReactNode có tên bản ghi in đậm (`<strong>`), `confirmText` nêu đúng hành động (“Kết thúc”), `loading` theo mutation.
4. Mọi thao tác phải có phản hồi: thành công thì `showToastMessage({ type: 'success', title: 'Đã tạm dừng chương trình' })`, lỗi thì `showToastMessage({ type: 'error', title: '…', message: error.message })`. Gắn trong `onSuccess`/`onError` của mutation; không bỏ qua lỗi. `App.tsx` đã mount sẵn `ToastContainer` của SDK cho mọi vị trí: trang chỉ gọi `showToastMessage`, không mount thêm `ToastContainer`.

## 5. Panel lọc: `ResizableMenu`

```tsx
import { FilterListIcon, FormItem, MultipleSelect, ResizableMenu, SearchIcon, TextField } from '@cogover/client-sdk/ui';

function ProgramFilterMenu() {
    const appSlug = useAppSlug();

    return (
        <ResizableMenu
            storageKey='promotion-programs'
            saveToLocalStorage
            resizeBarClassName={cx({ 'top-0': !appSlug })}
            collapsedIcon={({ expandMenu }) => (
                <button
                    type='button'
                    aria-label='Mở bộ lọc'
                    className={cx('mt-[1rem] flex w-full justify-center')}
                    onClick={expandMenu}
                >
                    <FilterListIcon fontSize={20} />
                </button>
            )}
        >
            <form
                className={cx('h-[calc(100svh-var(--top-toolbar-width))] overflow-auto')}
                onSubmit={(e) => e.preventDefault()}
            >
                <div className={cx('px-[1rem] py-[0.75rem]')}>
                    <div className={cx('mb-[1rem] h-[2.75rem] border-b border-divider-primary')}>
                        <span
                            className={cx(
                                'inline-flex h-[2.75rem] w-max items-center border-b-2 border-primary-main px-[0.5rem] py-[0.75rem]',
                                'prose-body1 text-primary-main',
                            )}
                        >
                            <FilterListIcon fontSize={20} className={cx('mr-[0.5rem]')} />
                            Bộ lọc ({visibleFields.length})
                        </span>
                    </div>
                    <div className={cx('mb-[1rem]')}>
                        <MultipleSelect
                            options={FILTER_FIELDS}
                            value={visibleFields}
                            onChange={setVisibleFields}
                            getLabel={(field) => field.label}
                            getValue={(field) => field.key}
                            fullWidth
                            tagVariant='gray'
                            appendToBody={false}
                        />
                    </div>
                    <div className={cx('mb-[1rem] flex justify-end')}>
                        <button
                            type='button'
                            className={cx('cursor-pointer prose-caption2 text-typo-secondary underline')}
                            onClick={resetFilters}
                        >
                            Đặt lại bộ lọc
                        </button>
                    </div>
                    <TextField
                        fullWidth
                        className={cx('mb-[1rem] w-full')}
                        placeholder='Tìm theo mã hoặc tên chương trình'
                        startAdornment={<SearchIcon />}
                        value={keyword}
                        onChange={(event) => setKeyword(event.target.value)}
                    />
                    {isVisible('status') && (
                        <FormItem
                            label='Trạng thái'
                            noOutLine
                            className={cx('mb-[1rem] w-full')}
                            component={
                                <MultipleSelect
                                    placeholder='Chọn trạng thái'
                                    options={STATUS_OPTIONS}
                                    value={statuses}
                                    onChange={setStatuses}
                                    getLabel={(option) => option.label}
                                    getValue={(option) => option.value}
                                    fullWidth
                                    showBorderOnBlur={false}
                                    tagVariant='gray'
                                    clearable
                                    appendToBody={false}
                                />
                            }
                        />
                    )}
                </div>
            </form>
        </ResizableMenu>
    );
}
```

Rules:

1. Thứ tự từ trên xuống: tab “Bộ lọc (n)” → ô chọn trường lọc → “Đặt lại bộ lọc” → ô tìm kiếm → các trường lọc.
2. `n` trong “Bộ lọc (n)” là **số trường đang hiển thị** trong panel. Ô `MultipleSelect` đầu panel cho người dùng chọn trường nào hiện ra (mặc định hiện hết); lưu lựa chọn vào `localStorage` trong `try/catch` theo key của màn.
3. “Đặt lại bộ lọc” đưa mọi giá trị lọc về mặc định.
4. Ô tìm kiếm là `TextField` có `startAdornment={<SearchIcon />}`, luôn hiện. Không dùng `SearchInput` trong panel lọc.
5. Mỗi trường lọc: `FormItem` với `noOutLine`, `className='mb-[1rem] w-full'`. Control dùng `fullWidth`, `showBorderOnBlur={false}`, `appendToBody={false}`; lựa chọn và người dùng `MultipleSelect` (`tagVariant='gray'`, `clearable`); ngày dùng `DateRangePicker` với `showDualCalendar={false}` (Cogover hiện 1 tháng trong panel lọc, lịch 2 tháng sẽ tràn mép phải); số dùng `NumberRangeInput` (`placeholder` ví dụ “Nhập số lượt”); chữ dùng `TextField`.
6. Lọc áp dụng ngay khi đổi giá trị, ô tìm kiếm debounce khoảng 500ms. Không có nút “Áp dụng”.
7. Đồng bộ điều kiện lọc lên URL bằng `useUrlFilters` của template (`src/hooks/useUrlFilters`), không tự viết hook đọc/ghi `useSearchParams`. Khai báo schema ở cấp module (`'string'` | `'list'` | `'number'`); `filters` là nguồn dữ liệu cho query, `updateFilters` ghi giá trị mới, `resetFilters` cho “Đặt lại bộ lọc”:

    ```tsx
    const FILTER_SCHEMA = { keyword: 'string', statuses: 'list', createdFrom: 'number', createdTo: 'number' } as const;

    const { filters, updateFilters, resetFilters } = useUrlFilters(FILTER_SCHEMA);
    // Ô tìm kiếm giữ state cục bộ, debounce rồi mới gọi updateFilters({ keyword }).
    // Trường lọc gọi thẳng: onChange={(statuses) => updateFilters({ statuses })}
    ```

8. Standalone: truyền `resizeBarClassName={cx({ 'top-0': !appSlug })}` cùng `STANDALONE_LAYOUT_VARS` ở mục 1; khi nhúng giữ mặc định của `ResizableMenu`.
9. Lọc theo bản ghi của object Cogover thì vẫn có thể dùng `FilterGenerator` (skill `custom-module-api` mục 13) đặt trong panel này.

## 6. Dữ liệu

1. Tổng số và mọi số liệu tổng hợp lấy từ backend (`total`, API tổng hợp). Không cộng dồn từ các dòng của trang hiện tại.
2. Query theo skill `custom-module-api`; dùng `placeholderData: keepPreviousData` để bảng không nháy khi đổi trang hay bộ lọc.
3. Query danh sách lỗi: hiện `Alert variant='warning'` (tiêu đề “Không tải được danh sách”, `message={error.message}`) phía trên `ListViewTable`, vẫn giữ header và panel lọc.

## 7. Good / Bad

Good: dùng `TableSettings` + `useTableV2` (Cấu hình cột lưu bằng `useSaveTableSetting`), `ListViewTable` với `pagination`, `PopperButton` Cài đặt, `GroupDropdownButton` Tạo, ⋮ bằng `PopperButton`, panel `ResizableMenu` có ô chọn trường lọc, `TextField` tìm kiếm, `FormItem noOutLine`.

Bad:

1. Tự viết `<table>`, hàng skeleton, phân trang hoặc thanh kéo panel.
2. Ô tìm kiếm và nút “Bộ lọc” trên header, bấm mở `Drawer`.
3. Dùng `SearchInput` cho ô tìm kiếm của panel lọc.
4. “Bộ lọc (n)” đếm số điều kiện đang lọc thay vì số trường đang hiển thị; thiếu ô chọn trường lọc.
5. Trạng thái dạng pill có nền (`bg-status-bg-*`, `rounded-full px-…`).
6. `dayjs(value).format('DD/MM/YYYY HH:mm')` hoặc `'hh:mm A'` viết cứng.
7. Dùng `ButtonGroup` cho nút tạo (đó là nhóm nút gạt, nền trắng) thay vì `GroupDropdownButton`.
8. Hàng thẻ KPI giữa header và bảng, nút làm mới riêng.
9. Tự giữ cột/sắp xếp/trang bằng `useState`, mục “Cấu hình cột” không làm gì.

## 8. Kiểm tra trước khi bàn giao

1. `npm run lint` pass.
2. Mở trang ở 1440×900 và 1280×720: `document.documentElement.scrollHeight <= window.innerHeight`, phân trang và đáy panel lọc nằm trong khung.
3. Kéo thanh panel lọc đổi được độ rộng; nút đóng/mở ở mép trái panel hoạt động.
4. Đối chiếu từng vùng với `assets/list-page-reference.jpg`: header, bảng, phân trang, panel lọc.
5. Xem cả light và dark theme.
