
const { urlencoded } = require('express')
const express = require('express')
const axios = require('axios')
const app = express()
app.use(express.json());
app.use(urlencoded({extended:false}))
const fetch = require('node-fetch');
var QRCode = require('qrcode')
require('dotenv').config()
const port = process.env.PORT || 4500
const key=process.env.KEY


/* const key='sl.BQPN1Tfi4oWb4GUQ9pHMCdS-amVxeB9p62YYcMaCNjsnml9xOwV2j-38QhCSMcnF9fvauoZnEX8D4WN95iogZZAeSrOFdnStxMaREUQ8boIsX5lHMc06IhLcegnNDlw--DW761479rY'
 */let async_job_id;

createMainFolder = async (res) => {
    console.log("main")
    let mainFolderUrl;
    let folderPath;
    try {
        const getData =  axios({
            method: 'post',
            url: 'https://api.dropboxapi.com/2/sharing/share_folder',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${key}`,
            },
            data: {
                "access_inheritance": "inherit",
                "acl_update_policy": "editors",
                "force_async": false,
                "member_policy": "anyone",
                "path": `/Data Governance App/Events/Maria`,
                "shared_link_policy": "anyone"
            }
        })

        const dataResponse = await getData;
        const folderUrl=  {mainFolderUrl:dataResponse.data.preview_url,folderPath:dataResponse.data.path_lower}
        console.log("folderUrl",folderUrl)
        //res.send(folderUrl)
        return   folderUrl

    } catch (e) {
        console.log("an error ocurred sharing ", e)
    }
}
checkIMgAsyncJob = async (res,async_job_id) => {
    console.log("check img",async_job_id)
    try {
    
        const getData = await axios({
            method: 'post',
            url: 'https://api.dropboxapi.com/2/sharing/check_share_job_status',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${key}`,
            },
            data: {
                "async_job_id":async_job_id
            }
        })

            const dataResponse = await getData;
            console.log("imgCheckdataResponse",dataResponse)
            const folderUrl= await dataResponse.data['.tag']==='in_progress'? await checkIMgAsyncJob(res,async_job_id): await {imgFolderUrl:dataResponse.data.preview_url,folderPath:dataResponse.data.path_lower}
            //const folderUrl=  await {imgFolderUrl:dataResponse.config.url,folderPath:dataResponse.data.path_lower}
      
        console.log("ImgfolderUrl",folderUrl)
        return   folderUrl

    } catch (e) {
        console.log("an error ocurred sharing ", e)
    }
}

createImgFolder = async (res) => {
    console.log("img")
    let mainFolderUrl;
    let folderPath;
    try {
    
        const getData = await axios({
            method: 'post',
            url: 'https://api.dropboxapi.com/2/sharing/share_folder',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${key}`,
            },
            data: {
                "access_inheritance": "inherit",
                "acl_update_policy": "editors",
                "force_async": false,
                "member_policy": "anyone",
                "path": `/Data Governance App/Events/Maria/MariaImg`,
                "shared_link_policy": "anyone"
            }
        })

        const dataResponse = await getData;
        console.log("ImgResponse",dataResponse)
        const folderUrl=  await dataResponse.data.async_job_id !=='' ? await checkIMgAsyncJob(res,dataResponse.data.async_job_id) : await {ImgfolderUrl:dataResponse.data.preview_url,folderPath:dataResponse.data.path_lower}
      //const folderUrl="yes"
        console.log("ImgfolderUrl",folderUrl)
        return   folderUrl

    } catch (e) {
        console.log("an error ocurred sharing ", e)
    }
}




const getQRCode= async ()=>{
    console.log("code")
    var opts = {
        errorCorrectionLevel: 'H',
        type: 'image/jpeg',
        quality: 1,
        margin: 1,
        scale:15
      }
    try {
        const code = await QRCode.toDataURL('http://www.platformable.com',opts)
        const finalCode = await code
        console.log(finalCode)
    } catch (error) {
        console.log(error)
    }
}



app.get("/", async (req,res)=>{

    const all =async ()=>{

        console.time("time")
        const x = await createMainFolder(res)
        const y  = await createImgFolder(res)
        const z = await getQRCode()
        console.timeEnd("time")
    }
    all()


})

app.get("/img", async (req,res)=>{

checkIMgAsyncJob(res,async_job_id)


})







/* PORT */

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })