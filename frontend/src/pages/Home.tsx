import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Login from "./Login";

const Home = () => {
  return (
    <div className="flex flex-col">
      <div className="flex justify-between p-4 border border-red-400">
        <h1>Name</h1>
        <div className=" flex gap-2">
          <Dialog>
            <DialogTrigger>
              <Button
                variant="ghost"
                type="submit"
                className="rounded-full  self-center cursor-pointer"
              >
                Sign In
              </Button>
            </DialogTrigger>

            <DialogContent>
               <DialogHeader>
                 <DialogTitle className="font-">Welcome Back</DialogTitle>
               </DialogHeader>
              <Login/>
            </DialogContent>
          </Dialog>
          <Button
            type="submit"
            className="rounded-full w-40 self-center cursor-pointer"
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
