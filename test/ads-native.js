// 広告テスト用スクリプト
document.addEventListener('DOMContentLoaded', function() {
    console.log('広告スクリプトが読み込まれました');
    
    // Google Analytics風のスクリプト（テスト用）
    (function() {
        window.ga = function() {
            console.log('Google Analytics call:', arguments);
        };
    })();
    
    // Google AdSense風のスクリプト（テスト用）
    (function() {
        window.adsbygoogle = window.adsbygoogle || [];
        console.log('AdSense スクリプト初期化');
    })();
    
    // 動的に広告を追加する関数
    function createDynamicAd() {
        const ad = document.createElement('div');
        ad.className = 'dynamic-ad';
        ad.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            width: 300px;
            height: 100px;
            background: linear-gradient(45deg, #ff9a9e, #fecfef);
            border: 2px solid #ff6b9d;
            border-radius: 10px;
            padding: 15px;
            z-index: 1000;
            color: white;
            text-align: center;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        `;
        ad.innerHTML = `
            <button onclick="this.parentElement.remove()" style="position: absolute; top: 5px; right: 5px; background: rgba(255,255,255,0.3); border: none; border-radius: 50%; width: 20px; height: 20px; cursor: pointer; color: white;">×</button>
            <h4 style="margin: 10px 0;">🚨 緊急通知 🚨</h4>
            <p style="margin: 0; font-size: 12px;">あなたのPCがウイルスに感染している可能性があります</p>
        `;
        document.body.appendChild(ad);
        
        // 10秒後に自動削除
        setTimeout(() => {
            if (ad.parentElement) {
                ad.remove();
            }
        }, 10000);
    }
    
    // 5秒後に動的広告を表示
    setTimeout(createDynamicAd, 5000);
    
    // バナー広告の自動ローテーション
    function rotateBannerAds() {
        const banners = document.querySelectorAll('.ad-banner');
        banners.forEach((banner, index) => {
            setTimeout(() => {
                banner.style.background = `linear-gradient(45deg, hsl(${Math.random() * 360}, 70%, 60%), hsl(${Math.random() * 360}, 70%, 60%))`;
            }, index * 2000);
        });
    }
    
    // 3秒おきにバナー広告の色を変更
    setInterval(rotateBannerAds, 3000);
    
    // 広告のトラッキング機能（テスト用）
    function trackAdView(adElement) {
        console.log('広告が表示されました:', adElement.className);
        // 実際の広告では外部サーバーにデータを送信
    }
    
    // すべての広告要素を監視
    const adElements = document.querySelectorAll('.ad-banner, .ad-sidebar, .advertisement, .ads, .ad-container, .google-ads, .adsense');
    adElements.forEach(ad => {
        trackAdView(ad);
        
        // クリック追跡
        ad.addEventListener('click', function() {
            console.log('広告クリック:', this.className);
            // 実際の広告では外部サーバーにクリックデータを送信
        });
    });
    
    // 偽のトラッキングピクセル
    function createTrackingPixel() {
        const pixel = document.createElement('img');
        pixel.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        pixel.style.cssText = 'width: 1px; height: 1px; position: absolute; top: -9999px;';
        pixel.className = 'tracking-pixel';
        document.body.appendChild(pixel);
        console.log('トラッキングピクセル配置');
    }
    
    createTrackingPixel();
    
    // 広告ブロッカー検出（テスト用）
    function detectAdBlocker() {
        const testAd = document.createElement('div');
        testAd.className = 'adsbox';
        testAd.style.cssText = 'position: absolute; left: -9999px; width: 1px; height: 1px;';
        document.body.appendChild(testAd);
        
        setTimeout(() => {
            if (testAd.offsetHeight === 0) {
                console.log('広告ブロッカーが検出されました');
                // 実際のサイトではここで代替コンテンツを表示
            } else {
                console.log('広告ブロッカーは検出されませんでした');
            }
            testAd.remove();
        }, 100);
    }
    
    detectAdBlocker();
    
    // // ページ離脱時の広告（Exit Intent）
    // function showExitIntentAd() {
    //     const exitAd = document.createElement('div');
    //     exitAd.style.cssText = `
    //         position: fixed;
    //         top: 0;
    //         left: 0;
    //         width: 100%;
    //         height: 100%;
    //         background: rgba(0,0,0,0.8);
    //         z-index: 9999;
    //         display: flex;
    //         justify-content: center;
    //         align-items: center;
    //     `;
    //     exitAd.innerHTML = `
    //         <div style="background: white; padding: 30px; border-radius: 10px; text-align: center; max-width: 400px;">
    //             <h2>ちょっと待って！</h2>
    //             <p>まだ見ていない特別オファーがあります</p>
    //             <button onclick="this.closest('div[style*=\"position: fixed\"]').remove()" style="background: #e74c3c; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin: 5px;">閉じる</button>
    //             <button style="background: #27ae60; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin: 5px;">特別オファーを見る</button>
    //         </div>
    //     `;
    //     document.body.appendChild(exitAd);
    // }
    
    // マウスがページ上部に移動した時の離脱広告
    let exitIntentShown = false;
    document.addEventListener('mouseleave', function(e) {
        if (e.clientY <= 0 && !exitIntentShown) {
            exitIntentShown = true;
            // showExitIntentAd();
        }
    });
});