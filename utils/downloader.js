const ytdl = require('ytdl-core');
const fs = require('fs-extra');
const path = require('path');
const { spawn } = require('child_process');

async function downloadYouTube(url, format = 'mp3') {
    try {
        const outputDir = path.join(__dirname, '../temp');
        await fs.ensureDir(outputDir);
        
        const timestamp = Date.now();
        const outputPath = path.join(outputDir, `${timestamp}.${format === 'mp3' ? 'mp3' : 'mp4'}`);
        
        if (format === 'mp3') {
            // Download as MP3 using ffmpeg
            const audioStream = ytdl(url, { quality: 'highestaudio' });
            const ffmpeg = spawn('ffmpeg', [
                '-i', 'pipe:0',
                '-acodec', 'libmp3lame',
                '-ab', '128k',
                outputPath
            ]);
            
            audioStream.pipe(ffmpeg.stdin);
            
            await new Promise((resolve, reject) => {
                ffmpeg.on('close', resolve);
                ffmpeg.on('error', reject);
                audioStream.on('error', reject);
            });
        } else {
            // Download as MP4
            const videoStream = ytdl(url, { quality: 'highestvideo' });
            const writeStream = fs.createWriteStream(outputPath);
            videoStream.pipe(writeStream);
            
            await new Promise((resolve, reject) => {
                writeStream.on('finish', resolve);
                writeStream.on('error', reject);
                videoStream.on('error', reject);
            });
        }
        
        if (await fs.pathExists(outputPath)) {
            const buffer = await fs.readFile(outputPath);
            await fs.remove(outputPath);
            return buffer;
        }
        
        throw new Error('Download failed');
    } catch (err) {
        console.error('Download error:', err);
        throw err;
    }
}

module.exports = { downloadYouTube };
