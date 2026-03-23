import InputBox from "../components/input";

const UserAuthForm = ({type}) => {
    return (
        <section className="h-cover flex items-center justify-center">
            <form className="w-[80%] max-w-[400px]">
                <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
                    {type == "sign-in" ? "Sign in" : "Sign up"}
                </h1>
                {
                    type !== "sign-in" ?
                    <InputBox 
                        name="fullname"
                        type="text"
                        placeholder="Full Name"
                        icon="fi-rr-user"
                    /> 
                    
                    : null
                }
                
                <InputBox 
                        name="email"
                        type="email"
                        placeholder="Email"
                        icon="fi-rr-envelope"
                    /> 
                <InputBox 
                        name="password"
                        type="password"
                        placeholder="Password"
                        icon="fi-rr-lock"
                    /> 

                <button 
                    className="center btn-dark mt-14"
                    type="submit"
                >
                    {type.replace("-", " ")}
                </button>
            </form>
        </section>
    )
}

export default UserAuthForm;