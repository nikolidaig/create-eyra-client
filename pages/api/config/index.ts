import Cors from 'cors'
import initMiddleware from '../../../utils/init-middleware'
import connectToDatabase from '../../../utils/connectToDatabase';
import Config from '../../../models/Config';

// Initialize the cors middleware. You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
const cors = initMiddleware( Cors({ methods: ['GET'] }) )

export default async function handler(req, res) {

    await cors(req, res)
    
    connectToDatabase();

    const {
        query: { id },
        method
    } = req;
    
    switch (method) {
        case 'GET': //Returns all documents in activities collection
            try {
                const config = await Config.find({});
                res.status(200).json({ success: true, data: config })
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case 'PUT': //Editing configuration
            try {
                const initConfig = await Config.find({});
                console.log("req.body._id",req.body._id,"initConfig.length",initConfig.length)
                console.log("initConfig",initConfig)
                //Check if a config document already exists.
                if (req.body._id == undefined && initConfig.length == 0){ 
                    //No config document exists. 
                    const config = await Config.create(req.body);
                    console.log("created config",config)
                    console.log("Successfully created config file.")
                } else {
                    //Config document already exists. Update it. 
                    const config = await Config.findByIdAndUpdate(req.body._id, req.body, {
                        new: true,
                        runValidators: true
                    });
                    console.log("Successfully updated config.")
                }
                res.status(200).json({ success: true });
            } catch (error) {
                console.log("Failed to update config.",error)
                res.status(400).json({ success: false });
            }
            break;
        default:
            console.log("Failed to updated config.")
            res.status(400).json({ success: false });
            break;
    }
}