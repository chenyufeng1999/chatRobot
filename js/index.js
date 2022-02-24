(function(){
    let page=0
    let size=10
    let chatTotal=0

    //封装获取dom的选择器
    function $(selector){
        return document.querySelector(selector)
    }

    //获取dom
    const doms={
        nickName:$('.nick-name'),
        accountName:$('.account-name'),
        loginTime:$('.login-time'),
        contentBody:$('.content-body'),
        sendBtn:$('.send-btn'),
        inputContainer:$('.input-container'),
        arrowContainer:$('.arrow-container'),
        selectContainer:$('.select-container'),
        clear:$('.clear'),
        close:$('.close')
    }

    //根据数据渲染聊天区域的函数
    function createChat(chatList,position='bottom'){
        if(chatList.length===0){    //没有聊天数据的情况
            doms.contentBody.innerHTML=`<div class="chat-container robot-container">
                                            <img src="./img/robot.jpg" alt="">
                                            <div class="chat-txt">
                                                您好！我是腾讯机器人，非常欢迎您的到来，有什么想和我聊聊的吗？
                                            </div>
                                        </div>`
        }

        //对数组进行操作(有聊天数据的情况)
        //给聊天区域添加上内容
        let html=chatList.map(item=>{
            return item.from==='robot'?`
                    <div class="chat-container robot-container">
                        <img src="./img/robot.jpg" alt="">
                        <div class="chat-txt">
                            ${item.content}
                        </div>
                    </div>`:`
                    <div class="chat-container avatar-container">
                        <img src="./img/avtar.png" alt="">
                        <div class="chat-txt">${item.content}</div>
                    </div> `
        }).join('')

        if(position!=='bottom'){
            doms.contentBody.innerHTML=html+doms.contentBody.innerHTML
            return
        }
        doms.contentBody.innerHTML+=html

        //将聊天滚动条滚动到最下方
        //获取所有的聊天块的最后一个
        const allContent=document.querySelectorAll('.chat-container')
        const lastContentDOM=allContent[allContent.length-1]
        const top=lastContentDOM.offsetTop
        doms.contentBody.scrollTo(0,top)
    }

    //获取用户的聊天记录
    async function getUserChatInfo(position){
        //判断是否还有数据
        if(chatTotal!==0 && chatTotal <= page * size) return
        const res=await myFetch({
            url:'/chat/history',
            params:{
                page,
                size
            }
        })
        if(res.chatTotal){
            chatTotal=res.chatTotal
        }
        page++
        //调用渲染聊天区域的函数
        createChat(res.data.reverse(),position)
    }

    //获取用户信息
    async function getUserInfo(){
        const res=await myFetch({
            url:'/user/profile'
        })
        
        if(res.code===1){   //存储的账号表示token值错误
            alert(res.msg)
            window.location.replace('login.html')
        }

        //将用户信息渲染到页面
        doms.nickName.innerText=res.data.nickname
        doms.accountName.innerText=res.data.loginId
        doms.loginTime.innerText=formatData(res.data.lastLoginTime)
        
    }

    //发送信息的点击函数
    async function sendBtnClick(){
        const value=doms.inputContainer.value.trim()
        if(value==='') return
        //拿到要发送的消息并渲染聊天内容
        createChat([{from:'avatar',content:value}])
        //清空输入框内容
        doms.inputContainer.value=''
        //发送请求给接口(发送聊天消息接口)
        const res=await myFetch({
            url:'/chat',
            method:'POST',
            params:{
                content:value
            }
        })
        //拿到接口返回的数据并渲染聊天内容
        createChat([{from:'robot',content:res.data.content}]) 

    }

    //下拉选择发送方式箭头的函数
    function arrowContainerClick(e){
        //打开或关闭的操作
        //判断doms.selectContainer是否有open类名
        let isOpen=doms.selectContainer.classList.contains('open')
        if(!isOpen){
            doms.selectContainer.classList.add('open')
        }else{
            doms.selectContainer.classList.remove('open')
        }
    }

    //清除按钮的函数
    function clearClick(){
        doms.inputContainer.value=''
    }

    //退出登录按钮的函数
    function closeClick(){
        //清除会话中的token并跳转页面
        sessionStorage.removeItem('token')
        window.location.replace('login.html')
    }

    //下拉选择改变键盘事件
    function selectContainerClick(e){
        const type=e.target.dataset.type
        if(type==='enter'){
            //切换样式
            const oldOnDOM=$('.on')
            oldOnDOM && oldOnDOM.classList.remove('on')
            e.target.classList.add('on')
            document.onkeydown=keyEnter
        }else if(type==='ctrlEnter'){
            //切换样式
            const oldOnDOM=$('.on')
            oldOnDOM && oldOnDOM.classList.remove('on')
            e.target.classList.add('on')
            document.onkeydown=function(e){
                if(e.code==='Enter' && e.ctrlKey){
                    //调用发送聊天接口的请求
                    sendBtnClick()
                }
            }
        }

    }

    //聊天区域滚动条事件函数
    function onScrollTo(){
        if(this.scrollTop===0){
            getUserChatInfo('nobottom')
        }
    }

    //默认键盘enter的触发事件函数
    function keyEnter(e){
        if(e.code==='Enter' && !e.ctrlKey){
            //调用发送聊天接口的请求
            sendBtnClick()
        }
    }

    //事件绑定入口
    function initEvent(){
        doms.sendBtn.addEventListener('click',sendBtnClick)
        doms.arrowContainer.addEventListener('click',arrowContainerClick)
        doms.clear.addEventListener('click',clearClick)
        doms.close.addEventListener('click',closeClick)
        doms.selectContainer.addEventListener('click',selectContainerClick)
        document.onkeydown=keyEnter
        doms.contentBody.addEventListener('scroll',onScrollTo)

    }

    //初始化函数
    function init(){
        getUserInfo()
        getUserChatInfo()
        initEvent()
    }
    init()
})()