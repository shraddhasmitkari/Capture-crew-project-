// import { Link } from "react-router-dom";

// const Footer = () => {
//   return (
//     <div>
//       <div className="container my-5">
//         <footer className="text-center text-lg-start bg-dark text-white">
//           <div className="container-fluid p-4 pb-0">
//             <section className="">
//               <div className="row">
//                 <div className="col-lg-6 col-md-6 mb-4 mb-md-0">
//                   <h5 className="text-uppercase text-white">
//                     EventSphere
//                   </h5>
//                   <p>
//                     "EventSphere: Where every detail is a work of art. Let's collaborate to make your event an extraordinary experience!"
//                   </p>
//                 </div>

//                 <div className="col-lg-6 col-md-6 mb-4 mb-md-0 d-flex justify-content-end">
//                   <div className="me-4">
//                     <h5 className="text-uppercase">
//                       <Link to="/about-us" className="text-white text-decoration-none">
//                         About us
//                       </Link>
//                     </h5>
//                   </div>
//                   <div>
//                     <h5 className="text-uppercase">
//                       <Link to="/contact-us" className="text-white text-decoration-none">
//                         Contact us
//                       </Link>
//                     </h5>
//                   </div>
//                 </div>
//               </div>
//             </section>
//           </div>

//           <div className="text-center p-3">
//             © 2024 Copyright:
//             <a className="text-white" href="#">
//               eventsphere.com
//             </a>
//           </div>
//         </footer>
//       </div>
//     </div>
//   );
// };

// export default Footer;

import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <div>
      <div class="container-fluid my-5">
        <footer class="text-center bg-warning text-lg-start text-color">
          <div class="container-fluid p-4 pb-0">
            <section class="">
              <div class="row">
                <div class="col-lg-4 col-md-6 mb-4 mb-md-0">
                  <h5 class="text-uppercase text-color">
                  Capture Crew
                  </h5>

                  <p className="d-flex justify-content-center text-justify align-items-center">
                  "Capture your precious moments with Capture Crew! Your one-stop destination for professional photography services, ensuring every memory is picture-perfect. Let us frame your story today!"
                  </p>
                </div>

                <div class="col-lg-2 col-md-6 mb-4 mb-md-0">
                  <h5 class="text-uppercase text-color-4">About us</h5>

                  <ul class="list-unstyled mb-0">
                    <li>
                      <a href="#!" class="text-color">
                        Link 1
                      </a>
                    </li>
                    <li>
                      <a href="#!" class="text-color">
                        Link 2
                      </a>
                    </li>
                    <li>
                      <a href="#!" class="text-color">
                        Link 3
                      </a>
                    </li>
                    <li>
                      <a href="#!" class="text-color">
                        Link 4
                      </a>
                    </li>
                  </ul>
                </div>

                <div class="col-lg-2 col-md-6 mb-4 mb-md-0">
                  <h5 class="text-uppercase text-color-4">Contact us</h5>

                  <ul class="list-unstyled mb-0">
                    <li>
                      <a href="#!" class="text-color">
                        Link 1
                      </a>
                    </li>
                    <li>
                      <a href="#!" class="text-color">
                        Link 2
                      </a>
                    </li>
                    <li>
                      <a href="#!" class="text-color">
                        Link 3
                      </a>
                    </li>
                    <li>
                      <a href="#!" class="text-color">
                        Link 4
                      </a>
                    </li>
                  </ul>
                </div>

                <div class="col-lg-2 col-md-6 mb-4 mb-md-0">
                  <h5 class="text-uppercase text-color-4">Careers</h5>

                  <ul class="list-unstyled mb-0">
                    <li>
                      <a href="#!" class="text-color">
                        Link 1
                      </a>
                    </li>
                    <li>
                      <a href="#!" class="text-color">
                        Link 2
                      </a>
                    </li>
                    <li>
                      <a href="#!" class="text-color">
                        Link 3
                      </a>
                    </li>
                    <li>
                      <a href="#!" class="text-color">
                        Link 4
                      </a>
                    </li>
                  </ul>
                </div>

                <div class="col-lg-2 col-md-6 mb-4 mb-md-0">
                  <h5 class="text-uppercase text-color-4">Links</h5>

                  <ul class="list-unstyled mb-0">
                    <li>
                      <a href="#!" class="text-color">
                        Link 1
                      </a>
                    </li>
                    <li>
                      <a href="#!" class="text-color">
                        Link 2
                      </a>
                    </li>
                    <li>
                      <a href="#!" class="text-color">
                        Link 3
                      </a>
                    </li>
                    <li>
                      <a href="#!" class="text-color">
                        Link 4
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <hr class="mb-4" />

            <section class="">
  <p class="d-flex justify-content-center align-items-center">
    <span class="me-3 text-color">Copyright 2024</span>
    <a href="" target="_blank" class="active">
      <button
        type="button"
        class="btn btn-rounded  text-white"
        style={{backgroundColor:"#AA336A"}}
      >
        CaptureCrewGroup
      </button>
    </a>
  </p>
</section>


            <hr class="mb-4" />
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Footer;
