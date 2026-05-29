import fs from 'fs';
import simpleGit from 'simple-git';

const git = simpleGit();
try {
    const log = await git.log({ n: 1 });
    const lastCommit = log.latest;
    const content = `
        Build at(+0): ${new Date().toISOString()}
        Build at(+7): ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}
        Last commit: 
        ${JSON.stringify(lastCommit, null, 2)}
        `;
    const dir = 'public/_app_name';
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    // Write the commit hash to a file: public/_end_user/meta.txt
    fs.writeFileSync(dir + '/meta.txt', content);
} catch (error) {
    console.error(`Error: ${error.message}`);
}
