(function(){
    //用于保存当前用户名是否已经存在
    let isExist=false

    //用户名失去焦点事件函数
    async function onBlurFn(){
        //重新获得焦点后失去时修改当前用户名状态
        isExist=false
        let value=this.value.trim()
        if(value==='') return
        //有值则发送请求
        // const res=await fetch(`https://study.duyiedu.com/api/user/exists?loginId=${value}`)
        // const result=await res.json()

        //使用封装好的myFetch方法发送请求
        const result=await myFetch({
            url:'/user/exists',
            params:{
                loginId:value
            }
        })

        if(result.code===0){    //表示该命名没有问题(不做任何操作)
            return 
        }
        //否则显示报错信息
        alert(result.msg)
    }

    //校验表单信息
    function regInfoCheck(options){
        switch(true){
            case !options.userName:
                window.alert('请输入用户名!')
                return 
            case !options.userNickname:
                window.alert('请输入用户昵称!')
                return 
            case !options.userPassword:
                window.alert('请输入用户密码!')
                return
            case options.userPassword!==options.userConfirmPassword:
                window.alert('两次输入的密码不一致!')
                return
            case isExist:
                window.alert('该用户名已经存在，请重新输入!')
                return
            default:
                return true
        }
    }

    //表单提交事件函数
    async function formSubmit(e){
        //阻止默认表单的提交
        e.preventDefault()
        const options={
            userName:userName.value,
            userNickname:userNickname.value,
            userPassword:userPassword.value,
            userConfirmPassword:userConfirmPassword.value
        }
        //表单校验(成功则返回true)
        const status=regInfoCheck(options)
        if(status){ //成功后的操作
            //发送请求给注册接口
            // const res=await fetch('https://study.duyiedu.com/api/user/reg',{
            //     method:'POST',
            //     headers:{
            //         'Content-Type':'application/json'
            //     },
            //     body:JSON.stringify({
            //         loginId:options.userName,
            //         nickname:options.userNickname,
            //         loginPwd:options.userPassword
            //     })
            // })
            // const result=await res.json()

            //使用封装好的myFetch方法发送请求
            const result=await myFetch({
                url:'/user/reg',
                method:'POST',
                params:{
                    loginId:options.userName,
                    nickname:options.userNickname,
                    loginPwd:options.userPassword
                }
            })

            if(result.code===0){    //表示没有错误，进行跳转
                window.location.replace('index.html')
            }else if(result.code===400){
                isExist=true
                alert(result.msg)
            }
            
        }

    }

    //事件绑定入口函数
    function initEvent(){
        userName.addEventListener('blur',onBlurFn)
        formContainer.addEventListener('submit',formSubmit)
    }
    //入口函数
    function init(){
        initEvent()
    }
    init()
})()