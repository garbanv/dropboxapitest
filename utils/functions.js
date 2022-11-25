const { urlencoded } = require("express");
const express = require("express");
const axios = require("axios");

const fetch = require("node-fetch");
var QRCode = require("qrcode");
const { URLSearchParams } = require("node:url");
const buffer = require("buffer/").Buffer;
require("dotenv").config();
const port = process.env.PORT || 4500;
const key = process.env.KEY;

let async_job_id;

exports.connectDropbox = async () => {
  const clientIdSecretEncoded = buffer
    .from(`${process.env.DBXCLIENT_ID}:${process.env.CLIENT_SECRET}`)
    .toString("base64");
  const urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "refresh_token");
  urlencoded.append("refresh_token", process.env.DBX_REFRESH_TOKEN);
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: `Basic ${clientIdSecretEncoded}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: urlencoded,
    redirect: "follow",
  };
  try {
    const res = fetch("https://api.dropbox.com/oauth2/token", requestOptions);
    const response = await res;
    const response1 = await response.json();
    const accessTokenResult = await response1.access_token;
    tokenFromRefresh = await accessTokenResult;
    return tokenFromRefresh;
  } catch {
    (error) => console.log("error from connectDropboxAndCreateFolders", error);
  }
};

exports.createAllFolders = async (client) => {
    console.log("tokenFromRefresh",tokenFromRefresh)
  try {
    const getData = axios({
      method: "post",
      url: "https://api.dropboxapi.com/2/files/create_folder_batch",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${tokenFromRefresh}`,
      },
      data: {
        autorename: false,
        force_async: false,
        paths: [
          `/clients/${CLIENT_ID}/ACTION_PLANS`,
          `/clients/${CLIENT_ID}/CBRA`,
          `/clients/${CLIENT_ID}/CONSENT`,
          `/clients/${CLIENT_ID}/IDG`,
          `/clients/${CLIENT_ID}/INTAKE`,
          `/clients/${CLIENT_ID}/LINKAGE_NAVIGATION`,
          `/clients/${CLIENT_ID}/MEDICAL`,
          `/clients/${CLIENT_ID}/MISCELLANEOUS`,
          `/clients/${CLIENT_ID}/SUPPORT_GROUPS`,
          `/clients/${CLIENT_ID}/TICKLER_UPDATES`,
        ],
      },
    });

    const dataResponse = await getData;

    console.log("dataResponse", dataResponse.status);
  } catch (e) {
    console.log("an error ocurred sharing ", e);
  }
};


/* exports.shareEventMainFolder = async (client) => {
  console.log("tokenFromRefresh share",tokenFromRefresh)
  try {
      const getData = axios({
          method: 'post',
          url: 'https://api.dropboxapi.com/2/sharing/share_folder',
          headers: {
              'Content-Type': 'application/json',
              authorization: `Bearer ${tokenFromRefresh}`,
          },
          data: {
              "access_inheritance": "inherit",
              "acl_update_policy": "editors",
              "force_async": false,
              "member_policy": "anyone",
              "path": `/datagovernance/Events/${client}`,
              "shared_link_policy": "anyone"
          }
      })

      const dataResponse = await getData;
      //BH console.log(dataResponse)
      console.log(">>>FOLDER<<<<");
      console.log('dataResponse.data: ', dataResponse.data);

      const data = await {
          url : dataResponse.data.preview_url,
          folderName: dataResponse.data.name ,
      }

  } catch (e) {
      console.log("an error ocurred sharing ", e)
  }
} */


exports.shareFolder = async (client,folder) => {
    console.log("tokenFromRefresh share",tokenFromRefresh)
    try {
        const getData = axios({
            method: 'post',
            url: 'https://api.dropboxapi.com/2/sharing/share_folder',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${tokenFromRefresh}`,
            },
            data: {
                "access_inheritance": "inherit",
                "acl_update_policy": "editors",
                "force_async": false,
                "member_policy": "anyone",
                "path": `/datagovernance/Events/${client}/${folder}`,
                "shared_link_policy": "anyone"
            }
        })

        const dataResponse = await getData;
        //console.log(dataResponse)
        console.log(">>>FOLDER<<<<");
        console.log('dataResponse.data: ', dataResponse.data);
        console.log("dataResponse.data.path_lower", dataResponse.data.path_lower);
        console.log('dataResponse.data.shared_folder_id: ', dataResponse.data.shared_folder_id);
        console.log('dataResponse.data.preview_url: ', dataResponse.data.preview_url);
        const data = await {
            url : dataResponse.data.preview_url,
            folderName: dataResponse.data.name ,
        }
        return data
    } catch (e) {
        console.log("an error ocurred sharing ", e)
    }
}





exports.createEventFolders = async (event) => {
  console.log("tokenFromRefresh",tokenFromRefresh)
try {
  const getData = axios({
    method: "post",
    url: "https://api.dropboxapi.com/2/files/create_folder_batch",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${tokenFromRefresh}`,
    },
    data: {
      autorename: false,
      force_async: false,
      paths: [
        `/Datagovernance/Events/${event}/Docs`,
        `/Datagovernance/Events/${event}/Images`,

      ],
    },
  });

  const dataResponse = await getData;

  console.log("dataResponse", dataResponse.status);
} catch (e) {
  console.log("an error ocurred sharing ", e);
}
};