(function(){
    //封装获取标签选择器的方法
    function $(selector){
        return document.querySelector(selector)
    }
    //获取dom
    const doms={
        formContainer:$('#formContainer'),
        userName:$('#userName'),
        userPassword:$('#userPassword'),
        signin:$('.signin')
    }

    //表单提交事件函数
    async function handleSubmitClick(e){
        //阻止默认提交表单
        e.preventDefault()
        //获取用户id和密码
        let options={
            userName:doms.userName.value,
            userPassword:doms.userPassword.value
        }
        if(!options.userName || !options.userPassword){
            alert('账号或密码未填写!')
            return 
        }
        //获取返回的状态
        const result=await sendRequest(options)
        if(result.code===0){    //错误码为0表示成功
            //跳转页面
            window.location.replace('index.html')
           
        }
        if(result.code===400){  //错误码为400表示登录失败
            alert(result.msg)
        }
    }

    //定义一个发送请求的函数
    /**
     * 
     * @param {Object} options 
     * options.userName     用户id
     * options.userPassword     用户密码
     */
    async function sendRequest(options){
        //发送请求
        // const res=await fetch('https://study.duyiedu.com/api/user/login',{
        //     method:'POST',
        //     headers:{
        //         'Content-Type':'application/json'
        //     },
        //     body:JSON.stringify({
        //         loginId:options.userName,
        //         loginPwd:options.userPassword
        //     })
        // })
        // const result=await res.json()

        //使用封装好的myFetch方法发送请求
        const result=await myFetch({
            method:'POST',
            url:'/user/login',
            params:{
                loginId:options.userName,
                loginPwd:options.userPassword
            }
        })
        return result
    }

    //事件监听入口
    function initEvent(){
        doms.formContainer.addEventListener('submit',handleSubmitClick)
    }
    //初始化入口
    function init(){
        initEvent()
    }
    init()
})()