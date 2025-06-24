// background.js - Service Worker for Ad Defender

// 拡張機能のアイコンがクリックされた時の処理
chrome.action.onClicked.addListener((tab) => {
    // アクティブなタブのcontent scriptに実行指示を送信
    chrome.tabs.sendMessage(tab.id, { action: 'startAdDefender' }, (response) => {
        if (chrome.runtime.lastError) {
            console.log('Content script not ready yet, injecting script...');
            // content scriptがまだ読み込まれていない場合は強制的に実行
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: executeAdDefender
            });
        } else {
            console.log('Ad Defender activated via message');
        }
    });
});

// content scriptが利用できない場合の代替実行関数
function executeAdDefender() {
    // content.jsの機能を直接実行
    if (typeof hideNonAdElements === 'function') {
        hideNonAdElements();
    } else {
        console.log('Ad Defender functions not available');
    }
}

// インストール時の処理
chrome.runtime.onInstalled.addListener(() => {
    console.log('Ad Defender installed');
});
