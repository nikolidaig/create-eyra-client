import connectToDatabase from '../../../utils/connectToDatabase';
import Member from '../../../models/Member';

connectToDatabase();

export default async (req, res) => {
    const {
        query: { id },
        method
    } = req;

    switch (method) {
        case 'GET':
            try {
                const member = await Member.findById(id);

                if (!member) {
                    return res.status(400).json({ success: false });
                }

                res.status(200).json({ success: true, data: member });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case 'PUT':
            try {
                //Update Member
                console.log("PUT| req.body = ",req.body);
                const member = await Member.findByIdAndUpdate(id, req.body, {
                    new: true,
                    runValidators: true
                });

                if (!member) {
                    return res.status(400).json({ success: false });
                }
                /*
                //Create activity log upon badgeOut
                if (!member.badgedIn){
                    console.log(member.Name,"badged out!");
                    try {
                        //Convert UTC to local time
                        let currDate = new Date();
                        let edt_offset = -5*60; //alternativelly,  currDate.getTimezoneOffset();
                        currDate.setMinutes(currDate.getMinutes() + edt_offset);

                        let badge = {
                            member: member,
                            badgeInTime: member.lastBadgeIn,
                            badgeOutTime: currDate
                        }
                        /*const session = await BadgeSession.create(badge, {
                            new: true,
                            runValidators: true
                        });
                        if (!session) {
                            console.log("ERROR at api/members/[id].js PUT - create activity log - \"Session\" undefined.");
                            //return res.status(400).json({ success: false });
                        }
                    } catch (error) {
                        console.log("ERROR at api/members/[id].js PUT - create activity log");
                        console.log("error: ",error);
                    }
                }*/
                if (member.badgedIn){ 
                    console.log(member.Name,"badged in!"); 
                } else { console.log(member.Name,"badged out!") }

                res.status(200).json({ success: true, data: member });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case 'DELETE':
            try {
                const deletedMember = await Member.deleteOne({ _id: id });

                if (!deletedMember) {
                    return res.status(400).json({ success: false })
                }

                res.status(200).json({ success: true, data: {} });
            } catch (error) {
                res.status(400).json({ success: false })
            }
            break;
        default:
            res.status(400).json({ success: false })
            break;
    }
}