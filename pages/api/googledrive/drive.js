const { google } = require('googleapis')
const path = require('path')
const fs = require('fs')

const CLIENT_ID = '468921089634-ep86ri60opjveepml1824i9eltvth00s.apps.googleusercontent.com'
const CLIENT_Secret = 'PnK2OlyG4wmJt_DyNZIfL4ti'
const REDIRECT_URL = 'https://developers.google.com/oauthplayground'

const REFRESH_TOKEN = '1//04HfPh9J7jZ0SCgYIARAAGAQSNwF-L9IrlkQLu5RvVjZ1nY4_u5Y2n1IITMmEpgVDnj1SBRDxpt-MGp-uEdxfCiFAZxMj95CLZ_o'

export default async (req,res) =>{
    const oauth2Client = new google.auth.OAuth2(
        CLIENT_ID,
        CLIENT_Secret,
        REDIRECT_URL
    )
    
    oauth2Client.setCredentials({refresh_token: REFRESH_TOKEN})
    
    const drive = google.drive({
        version: 'v3',
        auth: oauth2Client 
    })     
    
    if(req.method == "POST"){
        if(req.body.accion=='subir'){
            try {
                var folderId = '1OadUDGoSnZUBgfHaODdshvaZ-lFPoOaO';
                var fileMetadata = {
                    'name': 'gato.jpg',
                    parents: [folderId]
                  };
                var media = {
                    mimeType: 'image/jpg',
                    body: fs.createReadStream(path.join(process.cwd(),'/pages/api/googledrive/gato.jpg'))
                };
                  
                const filePath = path.join(process.cwd(),'/pages/api/googledrive/gato.jpg')
                const response = await drive.files.create({
                    resource: fileMetadata,
                    media: media,
                    fields: 'id'                  
                    // requestBody:{
                    //     name: 'prueba1.docx',
                    //     mimeType: 'image/jpg'
                    // },
                    // media: {
                    //     mimeType: 'image/jpg',
                    //     body: fs.createReadStream(filePath)
                    // }
                })
            console.log(response.data)
            res.status(200).json(response.data)
            } catch (error) {
                console.log(error.message)
            }
        }
        if(req.body.accion=='folder'){
            try {
                var fileMetadata = {
                    'name': 'Invoices',
                    'mimeType': 'application/vnd.google-apps.folder'
                  };
                const response = await drive.files.create({
                    resource: fileMetadata,
                    fields: 'id'
                })
            console.log(response.data)
            res.status(200).json(response.data)
            } catch (error) {
                console.log(error.message)
            }
        }
        if(req.body.accion=='eliminar'){
            try {
                const response = await drive.files.delete({
                    fileId: '19H-cEDRcQK-Ludcp3nlAfzzaNrFdnDYv'
                });
            console.log(response.data, response.status)
            res.status(200).json(response.data)
            
            } catch (error) {
                console.log(error.message)
            }
        }
        if(req.body.accion=='url'){
            try {
                const fileId = "17RuJq4ftx9I3bNcK3MmgrB_H_Y_FsBVr"
                await drive.permissions.create({
                    fileId:fileId,
                    requestBody: {
                        role: 'reader',
                        type: 'anyone'
                    }
                });

                const result = await drive.files.get({
                    fileId:fileId,
                    fields: 'webViewLink, webContentLink'
                });
            console.log(result.data)
            res.status(200).json(response.data)

            } catch (error) {
                console.log(error.message)
            }
        }
    }else if(req.method == "GET"){
        try {
            // const fileId = "19H-cEDRcQK-Ludcp3nlAfzzaNrFdnDYv"
            const result = await drive.files.list({
                //q: "mimeType='application/pdf'",
                fields: '*',
                spaces: 'drive',
                
            });
            res.status(200).json(result.data.files)

        } catch (error) {
            console.log(error.message)
        }
    }
}

