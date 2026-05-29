/**
 * Page mẫu TĨNH — route `hello`.
 * Demo dùng Tailwind + design token của template (không hardcode màu/px).
 */
export default function HelloPage() {
    return (
        <div className='rounded-[0.5rem] border border-divider-primary bg-background-default p-[1rem]'>
            <h2 className='prose-h5 mb-[0.5rem] text-typo-primary'>Hello từ Custom Module 👋</h2>
            <p className='prose-body2 text-typo-secondary'>
                Đây là page có pathname <span className='prose-body1 text-typo-primary'>tĩnh</span>:{' '}
                <code className='rounded-[0.25rem] bg-primary-light-96 px-[0.375rem] py-[0.125rem] text-primary-main'>
                    hello
                </code>
                .
            </p>
        </div>
    );
}
