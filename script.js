// AES 加密/解密工具 JavaScript 功能

// 全域變數
let currentMode = 'encrypt'; // 'encrypt' 或 'decrypt'
let currentTheme = 'light'; // 'light' 或 'dark'

document.addEventListener('DOMContentLoaded', function() {
    // 初始化主題
    initializeTheme();
    
    // 獲取 DOM 元素
    const cryptoForm = document.getElementById('cryptoForm');
    const modal = document.getElementById('modal');
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    const cryptoBtn = document.querySelector('.crypto-btn');
    const btnText = document.querySelector('.btn-text');
    const loading = document.querySelector('.loading');

    // 表單提交事件
    cryptoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (currentMode === 'encrypt') {
            performEncryption();
        } else {
            performDecryption();
        }
    });

    // 點擊模態框外部關閉
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // ESC 鍵關閉模態框
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
});

/**
 * 切換加密/解密模式
 * @param {string} mode - 'encrypt' 或 'decrypt'
 */
function switchMode(mode) {
    currentMode = mode;
    
    // 更新按鈕狀態
    const modeButtons = document.querySelectorAll('.mode-btn');
    modeButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // 更新主體配色主題
    const body = document.body;
    if (mode === 'decrypt') {
        body.classList.add('decrypt-mode');
    } else {
        body.classList.remove('decrypt-mode');
    }
    
    // 更新UI元素
    const inputLabel = document.getElementById('inputLabel');
    const inputData = document.getElementById('inputData');
    const cryptoBtn = document.getElementById('cryptoBtn');
    const btnText = document.querySelector('.btn-text');
    
    if (mode === 'encrypt') {
        inputLabel.textContent = '原始資料 (Raw Data)';
        inputData.placeholder = '請輸入要加密的資料...';
        btnText.innerHTML = '🔒 開始加密';
    } else {
        inputLabel.textContent = '加密資料 (Encrypted Data)';
        inputData.placeholder = '請輸入要解密的加密資料...';
        btnText.innerHTML = '🔓 開始解密';
    }
    
    // 清空輸入欄位
    inputData.value = '';
    document.getElementById('secretKey').value = '';
}

/**
 * 執行 AES 加密
 */
function performEncryption() {
    const inputData = document.getElementById('inputData').value.trim();
    const secretKey = document.getElementById('secretKey').value.trim();
    const cryptoBtn = document.querySelector('.crypto-btn');
    const btnText = document.querySelector('.btn-text');
    const loading = document.querySelector('.loading');

    // 驗證輸入
    if (!inputData) {
        showNotification('請輸入要加密的原始資料', 'error');
        return;
    }

    if (!secretKey) {
        showNotification('請輸入密鑰', 'error');
        return;
    }

    if (secretKey.length < 8) {
        showNotification('密鑰長度至少需要 8 個字符', 'error');
        return;
    }

    // 顯示載入狀態
    cryptoBtn.disabled = true;
    btnText.style.display = 'none';
    loading.style.display = 'inline-block';

    // 模擬加密過程
    setTimeout(() => {
        try {
            // 使用 CryptoJS 進行 AES 加密
            const encrypted = CryptoJS.AES.encrypt(inputData, secretKey).toString();
            
            // 顯示結果
            showCryptoResult(encrypted, '加密完成', '加密結果:');
            
            // 顯示成功通知
            showNotification('✅ 加密成功！', 'success');
            
        } catch (error) {
            console.error('加密過程中發生錯誤:', error);
            showNotification('❌ 加密失敗：' + error.message, 'error');
        } finally {
            // 恢復按鈕狀態
            cryptoBtn.disabled = false;
            btnText.style.display = 'inline-block';
            loading.style.display = 'none';
        }
    }, 800);
}

/**
 * 執行 AES 解密
 */
function performDecryption() {
    const inputData = document.getElementById('inputData').value.trim();
    const secretKey = document.getElementById('secretKey').value.trim();
    const cryptoBtn = document.querySelector('.crypto-btn');
    const btnText = document.querySelector('.btn-text');
    const loading = document.querySelector('.loading');

    // 驗證輸入
    if (!inputData) {
        showNotification('請輸入要解密的加密資料', 'error');
        return;
    }

    if (!secretKey) {
        showNotification('請輸入密鑰', 'error');
        return;
    }

    // 顯示載入狀態
    cryptoBtn.disabled = true;
    btnText.style.display = 'none';
    loading.style.display = 'inline-block';

    // 模擬解密過程
    setTimeout(() => {
        try {
            // 使用 CryptoJS 進行 AES 解密
            const decrypted = CryptoJS.AES.decrypt(inputData, secretKey);
            const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
            
            if (!decryptedText) {
                throw new Error('解密失敗，請檢查加密資料和密鑰是否正確');
            }
            
            // 顯示結果
            showCryptoResult(decryptedText, '解密完成', '解密結果:');
            
            // 顯示成功通知
            showNotification('✅ 解密成功！', 'success');
            
        } catch (error) {
            console.error('解密過程中發生錯誤:', error);
            let errorMessage = '❌ 解密失敗';
            
            if (error.message.includes('Malformed UTF-8')) {
                errorMessage += '：密鑰錯誤或加密資料損壞';
            } else if (error.message.includes('解密失敗')) {
                errorMessage += '：' + error.message.replace('解密失敗，', '');
            } else {
                errorMessage += '：' + error.message;
            }
            
            showNotification(errorMessage, 'error');
        } finally {
            // 恢復按鈕狀態
            cryptoBtn.disabled = false;
            btnText.style.display = 'inline-block';
            loading.style.display = 'none';
        }
    }, 800);
}

/**
 * 顯示加密/解密結果
 * @param {string} result - 處理後的資料
 * @param {string} title - 模態框標題
 * @param {string} label - 結果標籤
 */
function showCryptoResult(result, title, label) {
    const cryptoResult = document.getElementById('cryptoResult');
    const modal = document.getElementById('modal');
    const modalContent = document.querySelector('.modal-content');
    const modalTitle = document.getElementById('modalTitle');
    const resultLabel = document.getElementById('resultLabel');
    
    // 設置結果文本和標籤
    cryptoResult.value = result;
    modalTitle.textContent = (currentMode === 'encrypt' ? '✅ ' : '🔓 ') + title;
    resultLabel.textContent = label;
    
    // 重置動畫狀態
    modalContent.style.animation = 'modalSlideIn 0.3s ease forwards';
    
    // 顯示模態框
    modal.style.display = 'block';
    
    // 聚焦到結果文本框
    setTimeout(() => {
        cryptoResult.focus();
        cryptoResult.select();
    }, 300);
}

/**
 * 關閉模態框
 */
function closeModal() {
    const modal = document.getElementById('modal');
    const modalContent = document.querySelector('.modal-content');
    
    // 添加關閉動畫
    modalContent.style.animation = 'modalSlideOut 0.3s ease forwards';
    
    // 等待動畫完成後隱藏模態框
    setTimeout(() => {
        modal.style.display = 'none';
        // 重置動畫以便下次打開
        modalContent.style.animation = 'modalSlideIn 0.3s ease forwards';
    }, 300);
}

/**
 * 複製到剪貼簿
 */
async function copyToClipboard() {
    const cryptoResult = document.getElementById('cryptoResult');
    const copyBtn = document.querySelector('.copy-btn');
    const originalText = copyBtn.innerHTML;
    
    try {
        // 優先嘗試現代 Clipboard API（僅在安全上下文中可用）
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(cryptoResult.value);
            showNotification('✅ 已複製到剪貼簿！', 'success');
        } else {
            // 使用傳統的 execCommand 方法作為回退
            // 先確保文本框獲得焦點
            cryptoResult.focus();
            cryptoResult.select();
            
            // 嘗試執行複製命令
            const successful = document.execCommand('copy');
            if (successful) {
                showNotification('✅ 已複製到剪貼簿！', 'success');
            } else {
                // 如果 execCommand 也失敗，提供手動複製指引
                showNotification('⚠️ 請手動選擇文字並按 Ctrl+C 複製', 'error');
                return; // 提早返回，不執行按鈕狀態改變
            }
        }
        
        // 暫時改變按鈕文字以提供視覺反饋
        copyBtn.innerHTML = '✅ 已複製';
        copyBtn.style.background = '#28a745';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.style.background = 'linear-gradient(45deg, #28a745, #20c997)';
        }, 2000);
        
    } catch (error) {
        console.error('複製失敗:', error);
        
        // 自動選擇文字讓用戶手動複製
        cryptoResult.focus();
        cryptoResult.select();
        
        // 顯示更友善的錯誤訊息
        showNotification('⚠️ 自動複製不可用，文字已選取，請按 Ctrl+C 複製', 'error');
    }
}

/**
 * 全選文字功能（作為複製的備用方案）
 */
function selectAllText() {
    const cryptoResult = document.getElementById('cryptoResult');
    
    try {
        // 聚焦並選擇所有文字
        cryptoResult.focus();
        cryptoResult.select();
        cryptoResult.setSelectionRange(0, cryptoResult.value.length);
        
        showNotification('📋 文字已全選，請按 Ctrl+C 複製', 'success');
    } catch (error) {
        console.error('選擇文字失敗:', error);
        showNotification('⚠️ 請手動選擇文字', 'error');
    }
}

/**
 * 顯示通知
 * @param {string} message - 通知訊息
 * @param {string} type - 通知類型 ('success' 或 'error')
 */
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    // 設置訊息和類型
    notificationText.textContent = message;
    notification.className = 'notification';
    
    if (type === 'error') {
        notification.classList.add('error');
    }
    
    // 顯示通知
    notification.classList.add('show');
    
    // 3秒後自動隱藏
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

/**
 * 切換密碼顯示/隱藏
 */
function togglePassword() {
    const secretKeyInput = document.getElementById('secretKey');
    const toggleBtn = document.querySelector('.toggle-password');
    
    if (secretKeyInput.type === 'password') {
        secretKeyInput.type = 'text';
        toggleBtn.textContent = '🙈';
    } else {
        secretKeyInput.type = 'password';
        toggleBtn.textContent = '👁️';
    }
}

/**
 * 生成隨機密鑰（額外功能）
 */
function generateRandomKey(length = 16) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let result = '';
    
    for (let i = 0; i < length; i++) {
        result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    return result;
}

/**
 * 驗證加密結果（額外功能 - 解密驗證）
 */
function validateEncryption(encryptedData, originalData, secretKey) {
    try {
        const decrypted = CryptoJS.AES.decrypt(encryptedData, secretKey);
        const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
        return decryptedText === originalData;
    } catch (error) {
        console.error('驗證失敗:', error);
        return false;
    }
}

/**
 * 輸入驗證 - 即時反饋
 */
document.addEventListener('DOMContentLoaded', function() {
    const inputDataInput = document.getElementById('inputData');
    const secretKeyInput = document.getElementById('secretKey');
    
    // 密鑰強度檢查
    secretKeyInput.addEventListener('input', function() {
        const key = this.value;
        const strength = calculatePasswordStrength(key);
        const isDecryptMode = document.body.classList.contains('decrypt-mode');
        
        // 根據強度和模式改變邊框顏色
        if (key.length === 0) {
            this.style.borderColor = 'var(--border-color)';
        } else if (strength < 30) {
            this.style.borderColor = '#dc3545';
        } else if (strength < 60) {
            this.style.borderColor = '#ffc107';
        } else {
            // 根據當前模式使用不同的成功顏色
            this.style.borderColor = isDecryptMode ? 'var(--decrypt-primary)' : 'var(--encrypt-primary)';
        }
    });
});

/**
 * 計算密碼強度
 */
function calculatePasswordStrength(password) {
    let strength = 0;
    
    // 長度檢查
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 15;
    
    // 包含小寫字母
    if (/[a-z]/.test(password)) strength += 15;
    
    // 包含大寫字母
    if (/[A-Z]/.test(password)) strength += 15;
    
    // 包含數字
    if (/[0-9]/.test(password)) strength += 15;
    
    // 包含特殊字符
    if (/[^A-Za-z0-9]/.test(password)) strength += 15;
    
    return Math.min(strength, 100);
}

/**
 * 初始化主題
 */
function initializeTheme() {
    // 從本地儲存讀取主題設定，如果沒有則使用系統偏好
    const savedTheme = localStorage.getItem('theme');
    const systemDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    currentTheme = savedTheme || (systemDarkMode ? 'dark' : 'light');
    applyTheme(currentTheme);
    updateThemeIcon();
}

/**
 * 切換主題
 */
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(currentTheme);
    updateThemeIcon();
    
    // 儲存到本地
    localStorage.setItem('theme', currentTheme);
    
    // 顯示切換通知
    showNotification(
        currentTheme === 'dark' ? '🌙 已切換到深色主題' : '☀️ 已切換到淺色主題', 
        'success'
    );
}

/**
 * 應用主題
 * @param {string} theme - 'light' 或 'dark'
 */
function applyTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
}

/**
 * 更新主題圖標
 */
function updateThemeIcon() {
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
        themeIcon.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
    }
}