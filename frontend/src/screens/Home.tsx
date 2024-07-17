import MaxWidthWrapper from "@/component/MaxWidthWrapper";
// import useMediaQuery from '@mui/material/useMediaQuery';
import { Button } from "@/components/ui/button";

const Home = () => {

  // const smallScreen = useMediaQuery('(max-width:600px)');
  // const mediumScreen = useMediaQuery('(max-width:1000px)');
  // const bigScreen = useMediaQuery('(max-width:1500px)');
  // const largeScreen = useMediaQuery('(max-width:2000px)');

  return (
    <MaxWidthWrapper>
      <section className="flex w-full h-screen pt-5">
        {/* bar */}
        <section className="w-[300px] bg-[#f4f4f4]">
          <Button className="bg-black text-white hover:bg-gray-500">Add Task</Button>
        </section>

        <section className="flex-1 flex">
          {/* list of tasks */}
          <section className="w-1/2 bg-white">
            
          </section>

          {/* details */}
          <section className="w-1/2 bg-[#f4f4f4]">
            
          </section>
        </section>
        
      </section>
    </MaxWidthWrapper>
    
  )
}

export default Home;