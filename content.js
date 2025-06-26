// 広告判定のための定数定義
const AD_DETECTION_CONSTANTS = {
    // 除外リスト - "ad"を含むが広告ではない正当なクラス名・ID・属性名
    EXCLUDE_PATTERNS: [
        // --- UIコンポーネント系 ---
        'card', 'modal', 'badge', 'radio', 'accordion', 'slider',
        
        // --- 機能・アクション系 ---
        'download', 'add', 'upload', 'read', 'load', 'loading',
        
        // --- レイアウト・構造系 ---
        'padding', 'breadcrumb', 'header',
        
        // --- 管理画面・設定系 ---
        'admin', 'dashboard', 'advanced',
        
        // --- 状態・データ系 ---
        'address', 'thread', 'validation', 'ready', 'bad'
    ],
    
    // 広告判定用のキーワード - これらが含まれていれば広告と判定
    AD_KEYWORDS: [
        'ad', 'sponsor', 'advertisement', 'promo', 'promotion', 'google_ads'
    ],
    
    // 広告配信ドメイン
    AD_DOMAINS: [
        'googleads', 'googlesyndication', 'doubleclick', 'adsystem',
        'amazon-adsystem', 'facebook.com/tr', 'google-analytics',
        'googletagmanager', 'adsense', 'adnxs', 'adsystem.com',
        'ads.yahoo', 'advertising.com', 'adskeeper', 'outbrain',
        'taboola', 'revcontent', 'content.ad', 'smartadserver',
        'criteo', 'rubiconproject', 'pubmatic', 'openx'
    ],
    
    // 広告用URLパターン
    AD_URL_PATTERNS: [
        '/ads/', '/advertisement/', '/adsense/', '/adsbygoogle/',
        '/sponsor/', '/promotion/', '/banner/', '/commercial/',
        'ad.php', 'ads.js', 'adsystem', 'doubleclick'
    ]
};

/**
 * 要素から属性とURL情報を抽出する
 * @param {Element} element - 検査対象の要素
 * @returns {Object} 抽出された属性とURL情報
 */
function extractElementData(element) {
    const elementId = element.id ? element.id.toLowerCase() : '';
    const classNames = Array.from(element.classList).map(className => className.toLowerCase());
    const attributeNames = Array.from(element.attributes).map(attr => attr.name.toLowerCase());
    
    // URL属性を収集
    const urls = [
        element.src,
        element.href,
        element.getAttribute('data-src')
    ].filter(url => url).map(url => url.toLowerCase());
    
    return { elementId, classNames, attributeNames, urls };
}

/**
 * 除外パターンを適用して文字列をクリーンアップする
 * @param {Array} dataArray - クリーンアップ対象のデータ配列
 * @param {Array} excludePatterns - 除外パターンのリスト
 * @returns {Array} クリーンアップされたデータ配列
 */
function applyExcludePatterns(dataArray, excludePatterns) {
    return dataArray.map(item => {
        let cleanedItem = item;
        excludePatterns.forEach(pattern => {
            cleanedItem = cleanedItem.replace(new RegExp(pattern, 'g'), '');
        });
        return cleanedItem;
    });
}

/**
 * 属性・クラス・IDに基づいて広告判定を行う
 * @param {Object} elementData - 要素データ
 * @param {Array} adKeywords - 広告キーワードリスト
 * @returns {boolean} 広告かどうか
 */
function checkAdByAttributes(elementData, adKeywords) {
    const { elementId, classNames, attributeNames, urls } = elementData;
    
    for (const keyword of adKeywords) {
        const hasKeywordInId = elementId.includes(keyword);
        const hasKeywordInClass = classNames.some(className => className.includes(keyword));
        const hasKeywordInAttribute = attributeNames.some(attr => attr.includes(keyword));
        const hasKeywordInUrl = urls.some(url => url.includes(keyword));
        
        if (hasKeywordInId || hasKeywordInClass || hasKeywordInAttribute || hasKeywordInUrl) {
            return true;
        }
    }
    return false;
}

/**
 * URLパターンに基づいて広告判定を行う
 * @param {Array} urls - 検査対象のURL配列
 * @param {Array} adDomains - 広告ドメインリスト
 * @param {Array} adUrlPatterns - 広告URLパターンリスト
 * @returns {boolean} 広告かどうか
 */
function checkAdByUrl(urls, adDomains, adUrlPatterns) {
    for (const url of urls) {
        // ドメインチェック
        for (const domain of adDomains) {
            if (url.includes(domain)) {
                return true;
            }
        }
        
        // URLパターンチェック
        for (const pattern of adUrlPatterns) {
            if (url.includes(pattern)) {
                return true;
            }
        }
    }
    return false;
}

/**
 * 要素が広告かどうかを判定する
 * @param {Element} element - 判定対象の要素
 * @returns {boolean} 広告の場合true
 */
function isAd(element) {

    // 要素の属性とURL情報を抽出
    const elementData = extractElementData(element);
    
    // 除外パターンを適用してノイズを除去
    const cleanedData = {
        elementId: applyExcludePatterns([elementData.elementId], AD_DETECTION_CONSTANTS.EXCLUDE_PATTERNS)[0],
        classNames: applyExcludePatterns(elementData.classNames, AD_DETECTION_CONSTANTS.EXCLUDE_PATTERNS),
        attributeNames: applyExcludePatterns(elementData.attributeNames, AD_DETECTION_CONSTANTS.EXCLUDE_PATTERNS),
        urls: applyExcludePatterns(elementData.urls, AD_DETECTION_CONSTANTS.EXCLUDE_PATTERNS)
    };

    // 属性・クラス・IDベースでの広告判定
    if (checkAdByAttributes(cleanedData, AD_DETECTION_CONSTANTS.AD_KEYWORDS)) {
        return true;
    }

    // URLベースでの広告判定
    return checkAdByUrl(cleanedData.urls, AD_DETECTION_CONSTANTS.AD_DOMAINS, AD_DETECTION_CONSTANTS.AD_URL_PATTERNS);
}

/**
 * 要素の親要素のいずれかが広告かどうかを判定する
 * @param {Element} element - 判定対象の要素
 * @returns {boolean} 親要素に広告がある場合true
 */
function isParentAd(element) {
    let currentParent = element.parentElement;
    while (currentParent) {
        if (isAd(currentParent)) {
            return true;
        }
        currentParent = currentParent.parentElement;
    }
    return false;
}

/**
 * 基本的なHTML要素（常に表示する必要がある要素）のリスト
 */
const ALWAYS_VISIBLE_TAGS = ['HTML', 'HEAD', 'BODY', 'SCRIPT', 'STYLE', 'META', 'TITLE', 'LINK'];

/**
 * すべての要素を非表示にする（基本要素を除く）
 * @param {NodeList} allElements - すべての要素
 */
function hideAllElements(allElements) {
    allElements.forEach(element => {
        if (!ALWAYS_VISIBLE_TAGS.includes(element.tagName)) {
            element.style.opacity = '0';
            element.style.pointerEvents = 'none';
        }
    });
}

/**
 * 広告要素とその関連要素を特定して収集する
 * @param {NodeList} allElements - すべての要素
 * @returns {Object} 広告要素のセットと見つかった広告数
 */
function collectAdElements(allElements) {
    const adElementsSet = new Set();
    let adCount = 0;
    
    // 基本要素は常に表示対象に追加
    ALWAYS_VISIBLE_TAGS.forEach(tagName => {
        const elements = document.querySelectorAll(tagName.toLowerCase());
        elements.forEach(element => adElementsSet.add(element));
    });
    
    // 広告要素とその関連要素を収集
    allElements.forEach(element => {
        if (isAd(element)) {
            
            // 広告要素自体を追加
            adElementsSet.add(element);
            
            // すべての子要素を追加
            const childElements = element.querySelectorAll('*');
            childElements.forEach(child => adElementsSet.add(child));
            
            // すべての親要素を追加
            let currentParent = element.parentElement;
            while (currentParent && currentParent !== document.documentElement) {
                adElementsSet.add(currentParent);
                currentParent = currentParent.parentElement;
            }
            
            adCount++;
        }
    });
    
    return { adElementsSet, adCount };
}

/**
 * 指定された要素セットを表示状態にする
 * @param {Set} elementsSet - 表示する要素のセット
 */
function showElements(elementsSet) {
    elementsSet.forEach(element => {
        element.style.opacity = '1';
        element.style.pointerEvents = 'auto';
    });
}

/**
 * メイン処理：広告以外の要素を非表示にして、広告のみを表示する
 */
function hideNonAdElements() {
    const allElements = document.querySelectorAll("*");
    
    // Step 1: すべての要素を非表示にする（基本要素は除く）
    hideAllElements(allElements);
    
    // Step 2: 広告要素とその関連要素を収集
    const { adElementsSet, adCount } = collectAdElements(allElements);
    
    // Step 3: 広告関連要素のみを表示する
    showElements(adElementsSet);
}

// メッセージリスナー：background scriptからの実行指示を受信
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'startAdDefender') {
        
        // 非同期でメイン処理を実行
        requestAnimationFrame(() => {
            hideNonAdElements();
        });

        hideNonAdElements();
        
        
        // レスポンスを送信
        sendResponse({status: 'Ad Defender activated'});
    }
    
    return true; // 非同期レスポンスを有効にする
});

// DOMContentLoadedイベントは削除（自動実行を停止）
// 必要に応じて初期化のみ行う
document.addEventListener("DOMContentLoaded", () => {
    console.log("Ad Defender: Ready and waiting for user activation...");
});