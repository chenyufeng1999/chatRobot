//设置基础路径
const BASE_URL='https://study.duyiedu.com/api'

async function myFetch({method='GET',url,params={}}){
    let myUrl=BASE_URL+url
    if(method==='GET'){
        //将参数进行拼接?a=1&b=2
        myUrl+='?' + Object.keys(params).map(key=>`${key}=${params[key]}`).join('&')
    }
    //给需要token值的请求请求头加上Authorization
    const extendsObj={}
    sessionStorage.token && (extendsObj.Authorization='Bearer' + ' ' + sessionStorage.token)

    try {
        const res=await fetch(myUrl,{
            method,
            headers:{
                'Content-Type':'application/json',
                ...extendsObj
            },
            body:method==='GET'?null:JSON.stringify(params)
        })
        //在临时会话中存储用户权限的token值
        const token=res.headers.get('Authorization')
        token && sessionStorage.setItem('token',token)
    
        const result=res.json()
        return result

    } catch (error) {
        console.log(error)
    }
    
    
}