import { Plugin } from 'vite';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'fs';
import path from 'path';

//文章的metadata
interface ArticleConfig {
    title: string;
    created: Date;
    edited: Date;
    author: string;
    tags: string[];
}

//檔案的metadata interface
interface FileMetadata {
    path: string;                   //檔案路徑
    type: string;                   //檔案類型（副檔名）
    assets: string[];               //檔案相關的資源
    i18n: Record<string, string>;   //多國語言資料
    config?: ArticleConfig;         //檔案的相關配置（如果有）
}

//內容管理系統
interface ContentManagementSystem {
    [key: string]: FileMetadata | ContentManagementSystem;
}

//讀取資料夾，建立CMS資料內容
function parseContentDirectory(directory: string): ContentManagementSystem {
    const content: ContentManagementSystem = {};

    const files = readdirSync(directory);//檔案夾內的檔案列表

    files.forEach((file) => {
        const filePath = path.join(directory, file).replace(/\\/g, '/');//路徑
        const fileStat = statSync(filePath);//檔案的詳細資訊

        if (fileStat.isDirectory()) {
            // 如果是資料夾，遞迴解析內容
            content[file] = parseContentDirectory(filePath);
        } else {
            const fileExtension = path.extname(filePath).substring(1);
            const fileMetadata: FileMetadata = {
                path: filePath,
                type: fileExtension,
                assets: [],
                i18n: {},
            };

            if (file === 'index.md') {
                // 如果是index.md，讀取同檔案夾下對應的 config.json
                const configPath = path.join(directory, 'config.json');
                const configData = readFileSync(configPath, 'utf-8');
                const config = JSON.parse(configData);
                fileMetadata.config = config;
                delete content[file]; //移除原本index.md的內容
                delete content['config.json']//移除config.json的內容
            }

            content[file] = fileMetadata;
        }
    });

    return content;
}

//生成CMS的結構
function generateContentMetadata(): ContentManagementSystem {
    const contentDirectory = './content'; //讀取的資料夾路徑
    const contentSystem: ContentManagementSystem = parseContentDirectory(contentDirectory);
    return contentSystem;
}

//將CMS的內容寫入檔案
function writeContentMetadataFile(contentSystem: ContentManagementSystem, outputFilePath: string) {
    const contentMetadata = JSON.stringify(contentSystem, null, 2);
    writeFileSync(outputFilePath, contentMetadata);
}

export default function contentManagementPlugin(): Plugin {
    let contentSystem: ContentManagementSystem;

    function updateContentSystem() {
        contentSystem = generateContentMetadata();
        writeContentMetadataFile(contentSystem, './content/content-metadata.json');
    }

    return {
        name: 'Content-Management-System-Plugin',
        configureServer({ watcher }) {
            // 生成初始的 contentSystem
            updateContentSystem();

            // 監聽 content 資料夾的變化，並在檔案變更時更新 contentSystem
            watcher.add('./content/**');
            watcher.on('change', (filePath) => {
                console.log(`File ${filePath} changed.`);
                updateContentSystem();
            });
        },
    };
}