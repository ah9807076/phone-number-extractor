import fetch from 'node-fetch';
import fs from 'fs';
import { execSync } from 'child_process';

const ids = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60','61','62','63','64','65','66','67','68','69','70','71','72','73','74','75','76','77','78','79','80','81','82','83','84','85','86','87','88','89','90','91','92'];
const baseUrl = 'https://ethereal-heavy-aardwolf.glitch.me/fetch?url=https://toolsyep.com/ar/webpage-to-plain-text/?u=https://addarea.com/addarea/page/';
const results = [];
const repoUrl = 'https://github.com/ah9807076/phone-number-extractor.git';

async function fetchHtml(id) {
    const url = `${baseUrl}${id}`;
    const response = await fetch(url);
    const text = await response.text();

    const phoneRegex = /(\+20\d{9}|01\d{9})/g;
    const foundNumbers = text.match(phoneRegex) || [];

    if (foundNumbers.length > 0) {
        foundNumbers.forEach(number => {
            const result = `ID: ${id} - Phone Number: ${number}`;
            results.push(result);
        });
    } else {
        const result = `ID: ${id} - No number`;
        results.push(result);
    }
}

async function fetchAll() {
    const fetchPromises = ids.map(id => fetchHtml(id));

    await Promise.all(fetchPromises);

    const filePath = 'phone_numbers.txt';
    fs.writeFileSync(filePath, results.join('\n'), 'utf8');

    commitAndPushToGitHub(filePath);
}

function commitAndPushToGitHub(filePath) {
    const branchName = 'main';
    const pat = process.env.G_TOKEN;
    const remote = repoUrl.replace('https://', `https://${pat}@`);

    try {
        execSync(`git add ${filePath}`);
        execSync(`git commit -m \'Update phone numbers\'`);
        execSync(`git branch -M ${branchName}`);
        execSync(`git remote add origin ${remote}`);
        execSync(`git push -u origin ${branchName} --force`);
        console.log('File pushed to GitHub successfully');
    } catch (error) {
        console.error(`Failed to push to GitHub: ${error.message}`);
    }
}

(async () => {
    await fetchAll();
})();
