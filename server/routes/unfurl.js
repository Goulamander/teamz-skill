'use strict';

const Express = require('express');
const Router = Express.Router();
const urlMetadata = require('url-metadata');

const { validateHttpLink } = require('../utils')

Router.get('/', function(req, res, next) {
    let { link } = req.query
    if(!!link === false){
        res.status(422).json({ error: "Unfurled link not specified" });
        return;
    }
    let linkDomain = link.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
    
    urlMetadata(link)
    .then(data => {
        console.log("res",data);

        // Logic to get useful data
        let result = {
            image: '',
            logo: '',
            description: '',
        }
        let { other, ogp, twitter, oembed } = data
        
        /*
        // try get image url
        try{
            // first check with other
            if(other && other.ogImage && other.ogImage[0] && other.ogImage[0].url)
                result.image = other.ogImage[0].url
            if(!!result.image === false) {
                // 2nd check with ogp
                if(ogp && ogp.ogImage && ogp.ogImage[0] && ogp.ogImage[0].url)
                    result.image = ogp.ogImage[0].url
            }
            if(!!result.image === false) {
                // 3rd check with twitter
                if(twitter && twitter.twitterImage && twitter.twitterImage[0] && twitter.twitterImage[0].url)
                    result.image = twitter.twitterImage[0].url
            }
        } catch (error) {
            console.log("error fetching image", error)
        }

        // try get logo
        try{
            // first check with other.icon
            if(other && other.icon)
                result.logo = other.icon
            if(!!result.logo === false) {
                // 2nd check with other.shortcutIcon
                if(other && other.shortcutIcon)
                result.logo = other.shortcutIcon
            }
            // extract logo
            if(!!result.logo === true) {
                // check valid url
                if(!validateHttpLink(result.logo)) {
                    result.logo = linkDomain[0] + result.logo
                } else if(result.logo.indexOf('http') === -1) { 
                    result.logo = linkDomain[0] + result.logo
                }
            }
            
        } catch (error) {
            console.log("error fetching logo", error)
        }

        // try get description
        try{
            // first check with other
            if(other && other.description)
                result.description = other.description
            if(!!result.description === false) {
                // 2nd check with ogp
                if(ogp && ogp.ogDescription)
                result.ogDescription = ogp.ogDescription
            }
            if(!!result.description === false) {
                // 3rd check with twitter
                if(twitter && twitter.twitterDescription)
                    result.description = twitter.twitterDescription
            }
            
        } catch (error) {
            console.log("error fetching description", error)
        }
        */
         
        //try get description
        try {
            if(!!data.description) {
              result.description = data.description;
            }
            if(!!result.description == false) {
                if(!!data['og:description'])
                    result.description = data['og:description'];
            }
        } catch(error) {
            console.log(error);
        }
        
        //try get image
        try {
            if(!!data.image) {
              result.image = data.image;
            }
            if(!!result.image == false) {
                if(!!data['og:image'])
                    result.image = data['og:image'];
            }
        } catch(error) {
            console.log(error);
        }
  
        // try get logo
        result.logo = linkDomain[0] + 'favicon.ico';

        res.status(200).json({success:true, result:result});
    })
    .catch(err => {
        console.log("err",err);
        res.status(200).json({success:false, message:err});
    })
    
});

module.exports = Router;