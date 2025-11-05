import Link from "next/link";

export default function Footer() {
  return (
    <footer className=" bg-[#191919] text-white w-full text-lg">
      <div className="p-[2px] bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-xl"></div>
      <div className="flex items-center justify-center text-center bg-white text-black p-2 ">
        <h3 className="tracking-wide ">
           
          <span className="text-primary font-bold">
            Upgrade to Behance Pro today:
          </span> 
          Get advanced analytics, a custom portfolio website, and more features
          to grow your creative career.
        </h3>
      </div>
      <div className="max-w-5xl mx-auto w-full py-10">
        <div>
          <div className="pb-4">
            <Link href="/" className="text-4xl font-extrabold tracking-wide">
              Vibe
            </Link>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <h3 className="text-xl font-bold py-2 tracking-wide">Updates</h3>
              <div>
                <ul>
                  <li className="hover:underline">
                    <Link href={"/"}>About</Link>
                  </li>
                  <li className="hover:underline">
                    <Link href={"/"}>About</Link> 
                  </li>
                  <li className="hover:underline">
                    <Link href={"/"}>About</Link> 
                  </li>
                  <li className="hover:underline">
                    <Link href={"/"}>About</Link> 
                  </li>
                </ul>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold py-2">Updates</h3>
              <div>
                <ul>
                  <li className="hover:underline">
                    <Link href={"/"}>About</Link> 
                  </li>
                  <li className="hover:underline">
                    <Link href={"/"}>About</Link> 
                  </li>
                  <li className="hover:underline">
                    <Link href={"/"}>About</Link> 
                  </li>
                  <li className="hover:underline">
                    <Link href={"/"}>About</Link> 
                  </li>
                </ul>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold py-2">Updates</h3>
              <div>
                <ul>
                  <li className="hover:underline">
                    <Link href={"/"}>About</Link> 
                  </li>
                  <li className="hover:underline">
                    <Link href={"/"}>About</Link> 
                  </li>
                  <li className="hover:underline">
                    <Link href={"/"}>About</Link> 
                  </li>
                  <li className="hover:underline">
                    <Link href={"/"}>About</Link> 
                  </li>
                </ul>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold py-2">Updates</h3>
              <div>
                <ul>
                  <li className="hover:underline">
                    <Link href={"/"}>About</Link> 
                  </li>
                  <li className="hover:underline">
                    <Link href={"/"}>About</Link> 
                  </li>
                  <li className="hover:underline">
                    <Link href={"/"}>About</Link> 
                  </li>
                  <li className="hover:underline">
                    <Link href={"/"}>About</Link> 
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div></div>
      </div>
      <hr></hr>
      <div className="flex items-center justify-center text-center p-4 ">
        <span className="text-sm">© 2025 Adobe Inc. All rights reserved.</span>
      </div>
    </footer>
  );
}
