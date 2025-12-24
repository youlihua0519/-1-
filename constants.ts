
export const COLORS = {
  GOLD: '#FFD700',
  RED: '#D42426',
  DARK_GREEN: '#0A2F1F',
  LIGHT_GREEN: '#2E8B57',
  WHITE: '#FFFFFF',
};

export const PARTICLE_COUNT = window.innerWidth < 768 ? 5000 : 12000;
export const PHOTO_COUNT = 10;
export const GESTURE_SENSITIVITY = 0.05;

/** 
 * --- 本地资源替换指南 ---
 * 
 * 1. 确保你的图片放在项目根目录下的某个文件夹中（例如 images/）
 * 2. 路径必须以 './' 开头，表示从当前目录开始寻找
 * 3. 注意文件名的大小写必须完全一致（例如 .JPG 和 .jpg 是不同的）
 */

// 1. Logo 替换：将下面的路径换成你自己的图片路径
// 如果你的图片叫 logo.png 放在 images 文件夹里，就写成 './images/logo.png'
export const LOGO_URL = './images/logo.PNG'; 

// 2. 背景音乐替换：
export const MUSIC_URL = './music/bgm.mp3';

// 3. 10张照片替换：
// 请确保数组里恰好有 10 个路径。如果照片不够，可以重复使用。
export const PHOTO_URLS = [
  './images/photo_01.JPG',
  './images/photo_02.JPG',
  './images/photo_03.JPG',
  './images/photo_04.JPG',
  './images/photo_05.JPG',
  './images/photo_06.JPG',
  './images/photo_07.JPG',
  './images/photo_08.JPG',
  './images/photo_09.JPG',
  './images/photo_10.JPG',
];
