import Event from "./component/Event";
import { useEffect } from 'react';
import axios from 'axios';


function Home () {
    useEffect(() => {
        const getAccess = async () => {
            let access_token = await axios.get('/auth/api/getAccessToken');




        }

        getAccess;
    }, [])


    return (
        <div className="flex gap-10 justify-evenly mt-10 relative">
            <div className="flex flex-col items-center gap-20">   
                <Event time={"10:30am"} place={"Sanctuary Hotel"} action={"Drinking Alcohol"} day={"Today"}/> 
                <Event time={"3:30pm"} place={"Ben's House"} action={"League"} day={"Today"}/> 
            </div>

            <div className="flex flex-col items-center gap-20 mt-15">   
                <Event time={"2:00pm"} place={"Sanctuary Hotel"} action={"Drinking Alcohol"} day={"Tomorrow"}/>  
                <Event time={"5:00pm"} place={"Perry Park Stadium"} action={"Playing Volleyball"} day={"Tomorrow"}/>  
            </div>

            <div className="absolute w-0.5 border opacity-2 shadow-2xl h-150"></div>
        </div>
    )
}

export default Home;
