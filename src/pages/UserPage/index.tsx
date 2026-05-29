import { Link, useParams } from 'react-router-dom';

/**
 * Page mẫu ĐỘNG — route `user/:userId`.
 * Demo `useParams()` đọc param từ host router (cần react-router-dom là singleton trong `shared`).
 */
export default function UserPage() {
    const { userId } = useParams();

    return (
        <div className='rounded-[0.5rem] border border-divider-primary bg-background-default p-[1rem]'>
            <h2 className='prose-h5 mb-[0.5rem] text-typo-primary'>Trang người dùng</h2>
            <p className='prose-body2 mb-[0.75rem] text-typo-secondary'>
                Pathname <span className='prose-body1 text-typo-primary'>động</span>:{' '}
                <code className='rounded-[0.25rem] bg-primary-light-96 px-[0.375rem] py-[0.125rem] text-primary-main'>
                    user/:userId
                </code>
            </p>
            <div className='prose-body2 text-typo-secondary'>
                Param đọc được: <span className='prose-body1 text-primary-main'>userId = {userId}</span>
            </div>

            <Link to='../hello' className='prose-body2 mt-[1rem] inline-block text-primary-main'>
                ← Về trang hello
            </Link>
        </div>
    );
}
