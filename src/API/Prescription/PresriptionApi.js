export  const get_prescription=async (episodeId)=>{
    // console.log(episodeId)
    const headers = {
        Accept: 'application/json',
        "Content-type": "application/json"
    }
    if(episodeId)
    {
        try {
            const response = await fetch(process.env.REACT_APP_API + "/get_pres/", {
                method: "POST",
                headers: headers,
                body: JSON.stringify({ id: episodeId })
            });
            const data = await response.json();
          
            if (response.status !== 200 && response.status !== 201) {
                return [];
            }
            // console.log(data)
            return data;
        } catch (err) {
            // console.log(err)
            return [];
        }
    }
    
}

