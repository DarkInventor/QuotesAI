// "use client";

// import { useState } from "react";
// import axios from "axios";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { cn } from "@/lib/utils";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

// function DashboardPage() {
//   const [tag, setTag] = useState("");
//   const [quotes, setQuotes] = useState([]);
//   const [specialQuote, setspecialQuote] = useState([]);

//   const getQuotes = async () => {
//     const response = await axios.get(`/api/scrapper?tag=${tag}`);
//     setQuotes(response.data.quotes);
//     setspecialQuote(response.data.specialQuote);
//   };

//   return (
//     <div className={cn("grid gap-6 my-2 justify-center w-9/12 mx-auto")}>
//       <div className="grid gap-2">
//         <div className="grid">
//           <Label className="sr-only" htmlFor="Mood">
//             Enter your Mood 👇🏻
//           </Label>
//           <Input
//             id="tag"
//             placeholder="Inspirational..."
//             type="text"
//             autoCapitalize="none"
//             autoCorrect="off"
//             required
//             value={tag}
//             onChange={(e) => setTag(e.target.value)}
//           />
//         </div>
//         <Button onClick={getQuotes}>Get Today&apos;s Quotes</Button>
//       </div>

//       {/* Special Quote */}
//       <div className="grid justify-center mx-auto items-center w-8/12">
//         <Card>
//           <CardHeader>
//             <CardTitle>{specialQuote}</CardTitle>
//             <CardDescription>
//               <a href="https://www.goodreads.com/quotes/tag/inspirational">Today&apos;s Special Quote for you</a>
//             </CardDescription>
//           </CardHeader>
//         </Card>
//         </div>
//       <div className="md:grid md:grid-cols-2 md:gap-3 lg:grid lg:grid-cols-3 lg:gap-4 relative justify-center mx-auto">
        
//         {quotes.map((quote, index) => (

          
            
//           <Card key={index} className="w-[350px]">
//             <CardHeader>
//               <CardTitle>{quote}</CardTitle>
//               <CardDescription>
//                 <a href="https://www.goodreads.com/quotes/tag/inspirational">Visit this website for daily quotes</a>
//               </CardDescription>
//             </CardHeader>
//             {/* @ts-ignore */}
//             {/* <CardContent> */}
//                {/* @ts-ignore */}
//               {/* <p key={index}>{quote}</p>
//             </CardContent> */}
//           </Card>
         
//         ))}
       
//          </div>
//       </div>
   
//   );
// }

// export default DashboardPage;

"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function DashboardPage() {
  const [hasPaid, setHasPaid] = useState(false);
  const [tag, setTag] = useState("");
  const [quotes, setQuotes] = useState([]);
  const [specialQuote, setspecialQuote] = useState([]);

  // useEffect(() => {
    const handleCheckout = async () => {
      // Call your API endpoint to create a checkout session
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const { url } = await res.json();
  
      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      } else {
        // Handle error (e.g., display a message)
        console.error('Failed to start the checkout process.');
      }
  
      
    };

  //   checkPaymentStatus();
  // }, []);

  // if (!hasPaid) {
  //   return <div>Please make a payment to access this feature.</div>;
  // }

  
  const getQuotes = async () => {
    const response = await axios.get(`/api/scrapper?tag=${tag}`);
    setQuotes(response.data.quotes);
    setspecialQuote(response.data.specialQuote);
  };
  // if (hasPaid) {
  return (
    <div className={cn("grid gap-6 my-2 justify-center w-9/12 mx-auto")}>
      <div className="grid gap-2">
        <div className="grid">
          <Label className="sr-only" htmlFor="Mood">
            Enter your Mood 👇🏻
          </Label>
          <Input
            id="tag"
            placeholder="Inspirational..."
            type="text"
            autoCapitalize="none"
            autoCorrect="off"
            required
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          />
        </div>
        <Button onClick={handleCheckout}>Get Today&apos;s Quotes</Button>
      </div>

      {/* Special Quote */}
      <div className="grid justify-center mx-auto items-center w-8/12">
        <Card>
          <CardHeader>
            <CardTitle>{specialQuote}</CardTitle>
            <CardDescription>
              <a href="https://www.goodreads.com/quotes/tag/inspirational">Today&apos;s Special Quote for you</a>
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="md:grid md:grid-cols-2 md:gap-3 lg:grid lg:grid-cols-3 lg:gap-4 relative justify-center mx-auto">
        {quotes.map((quote, index) => (
          <Card key={index} className="w-[350px]">
            <CardHeader>
              <CardTitle>{quote}</CardTitle>
              <CardDescription>
                <a href="https://www.goodreads.com/quotes/tag/inspirational">Visit this website for daily quotes</a>
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
// }

export default DashboardPage;