// popup.js - Popup interface for Ad Defender

document.addEventListener('DOMContentLoaded', function() {
    const activateBtn = document.getElementById('activateBtn');
    const resetBtn = document.getElementById('resetBtn');
    const status = document.getElementById('status');
    
    // 広告のみ表示を開始するボタン
    activateBtn.addEventListener('click', function() {
        status.textContent = '実行中...';
        
        // アクティブなタブを取得
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            const activeTab = tabs[0];
            
            // content scriptにメッセージを送信
            chrome.tabs.sendMessage(activeTab.id, {action: 'startAdDefender'}, function(response) {
                if (chrome.runtime.lastError) {
                    status.textContent = 'エラー: ページを更新してください';
                    console.error('Error:', chrome.runtime.lastError);
                } else {
                    status.textContent = '広告のみ表示モードが実行されました';
                    setTimeout(() => {
                        window.close(); // ポップアップを閉じる
                    }, 1000);
                }
            });
        });
    });
    
    // ページリセットボタン
    resetBtn.addEventListener('click', function() {
        status.textContent = 'リセット中...';
        
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            const activeTab = tabs[0];
            
            // ページをリロード
            chrome.tabs.reload(activeTab.id);
            status.textContent = 'ページがリセットされました';
            setTimeout(() => {
                window.close();
            }, 500);
        });
    });
    
    // 初期状態の確認
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const activeTab = tabs[0];
        if (activeTab.url.startsWith('chrome://') || activeTab.url.startsWith('chrome-extension://')) {
            status.textContent = 'このページでは使用できません';
            activateBtn.disabled = true;
            activateBtn.style.opacity = '0.5';
        }
    });
});
