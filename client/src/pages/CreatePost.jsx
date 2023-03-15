import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import getRandomPrompt from '../utils/index';
import { FormField , Loader } from '../components';
import preview from '../assets/preview.png';

const CreatePost = () => {

    const navigate = useNavigate();
    const [form,setForm] = useState({
        name:"",
        prompt:"",
        photo:"",
    });

    const [generatingImg,setGeneratingImg] = useState(false);  // use while we are contacting api and we are witing for image
    const [loading,setLoading] = useState(false);

    const generateImg = async () => {
        if(form.prompt){
            try{
                setGeneratingImg(true);
                const response = await fetch("https://imagenator-backend.onrender.com/api/v1/dalle" , {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ prompt: form.prompt }),
                });
        
                const data = await response.json();
                setForm({...form , photo: `data:image/jpeg;base64,${data.photo}`});
                
            }catch(err){
                alert(err);
            }finally{
                setGeneratingImg(false);
            }
        }else{
            alert("Please enter a prompt!");
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(form.prompt && form.photo){
            setLoading(true);

            try{
                const response = await fetch("https://imagenator-backend.onrender.com/api/v1/post" ,{
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(form)
                })

                await response.json();
                navigate('/');
            }catch(err){
                alert(err);
            }finally{
                setLoading(false);
            }
        }else{
            alert("Please enter a prompt and generate an image!")
        }
    }

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSurpriseMe = () => {
        const randomPrompt = getRandomPrompt(form.prompt);
        setForm({ ...form, prompt: randomPrompt });
    };

    return (
        <section className="max-w-7xl mx-auto">
            <div>
                <h1 className="font-extrabold text-[#222328] text-[32px]">Create</h1>
                <p className="mt-2 text-[#666e75] text-[16px] ">
                    Create imaginative and visually stunning images through AI and share them with the community
                </p>
            </div>

            <form className="mt-16 max-w-3xl" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-5">
                    <FormField 
                        labelName="Your Name"
                        type="text"
                        name="name"
                        placeholder="John Doe"
                        value={form.name}
                        handleChange={handleChange}
                    />

                    <FormField
                        labelName="Prompt"
                        type="text"
                        name="prompt"
                        placeholder="teddy bears shopping for groceries in Japan"
                        value={form.prompt}
                        handleChange={handleChange}
                        isSurpriseMe
                        handleSurpriseMe={handleSurpriseMe}
                    />

                    <div className="relative bg-grey-50 border border-gray-300 text-gray-900 text-smrounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center">
                        {form.photo 
                        ? ( <img src={form.photo} alt={form.prompt} className="w-full h-full object-contain"/> )
                        : (<img src={preview} alt="preview" className="w-9/12 h-9/12 object-contain opacity-40"/>)
                        }

                        {generatingImg && (
                            <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                                <Loader />
                            </div>
                        )}
                    </div>
                </div>
                <div className="mt-5 flex gap-5">
                    <button type="button" onClick={generateImg} className="text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center">
                        {generatingImg ? "Generating..." : "Generate"}
                    </button>
                </div>

                <div className="mt-10">
                    <p className="mt-2 text-[14px] text-[#666e75]">
                        Once you have created the image you want, you can share it with others in the community.
                    </p>
                    <button type="submit" className="mt-8 text-white bg-[#6468ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center">
                        {loading ? "Sharing..." : "Share with the community" }
                    </button>
                </div>
            </form> 
        </section>
    )
}

export default CreatePost;
