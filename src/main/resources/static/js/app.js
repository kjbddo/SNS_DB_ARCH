// SNS 애플리케이션 JavaScript

// API 호출 헬퍼 함수
async function apiCall(url, method = 'GET', data = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        }
    };
    
    if (data) {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('API 호출 오류:', error);
        alert('오류가 발생했습니다.');
    }
}

// 로그인 폼 처리
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // 실제로는 인증 API를 호출해야 함
            console.log('로그인:', { username, password });
            // window.location.href = '/feed';
        });
    }
    
    // 회원가입 폼 처리
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = {
                username: document.getElementById('username').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
                name: document.getElementById('name').value
            };
            
            const result = await apiCall('/api/users', 'POST', formData);
            if (result.success) {
                alert('회원가입이 완료되었습니다.');
                window.location.href = '/login';
            }
        });
    }
    
    // 게시물 작성 폼 처리
    const createPostForm = document.getElementById('createPostForm');
    if (createPostForm) {
        createPostForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            // 게시물 작성 로직
            console.log('게시물 작성');
        });
    }
    
    // 이미지 미리보기
    const imageInput = document.getElementById('imageInput');
    if (imageInput) {
        imageInput.addEventListener('change', function(e) {
            const files = e.target.files;
            const preview = document.getElementById('imagePreview');
            preview.innerHTML = '';
            
            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.style.width = '100px';
                    img.style.height = '100px';
                    img.style.objectFit = 'cover';
                    img.style.margin = '4px';
                    preview.appendChild(img);
                };
                reader.readAsDataURL(file);
            });
        });
    }
    
    // 좋아요 버튼 처리
    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
            const postId = this.dataset.postId;
            // 좋아요 API 호출
            console.log('좋아요:', postId);
        });
    });
    
    // 댓글 작성
    const commentForm = document.getElementById('commentForm');
    if (commentForm) {
        commentForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const content = document.getElementById('commentInput').value;
            // 댓글 작성 API 호출
            console.log('댓글 작성:', content);
        });
    }
    
    // 검색 탭 전환
    document.querySelectorAll('.search-tabs .tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.dataset.tab;
            document.querySelectorAll('.search-tabs .tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.search-tab-content').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            document.getElementById(tab + 'Tab').classList.add('active');
        });
    });
    
    // 설정 탭 전환
    document.querySelectorAll('.settings-nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href').substring(1);
            document.querySelectorAll('.settings-nav-item').forEach(i => i.classList.remove('active'));
            document.querySelectorAll('.settings-section').forEach(s => s.classList.remove('active'));
            this.classList.add('active');
            document.getElementById(target).classList.add('active');
        });
    });
    
    // 채팅방 로드
    window.loadChatRoom = function(roomId) {
        // 채팅방 로드 로직
        console.log('채팅방 로드:', roomId);
    };
});

