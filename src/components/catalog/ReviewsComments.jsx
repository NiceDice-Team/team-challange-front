import StarRating from "../layout/StarsLine";
import SubscribeSection from "../home/SubscribeSection";
import ReviewCard from "../home/ReviewCard";
import PERSON1_IMG from "../../../public/Reviews/person1.png";
import PERSON2_IMG from "../../../public/Reviews/person2.png";
import PERSON3_IMG from "../../../public/Reviews/person3.png";
import REVIEW_1_IMG1 from "../../../public/Reviews/review1_1.png";
import REVIEW_1_IMG2 from "../../../public/Reviews/review1_2.png";
import REVIEW_2_IMG1 from "../../../public/Reviews/review2_1.png";
import REVIEW_2_IMG2 from "../../../public/Reviews/review2_2.png";

// Demo review data
const reviewComments = [
  {
    rating: 5,
    date: "March 28, 2025",
    avatarSrc: PERSON1_IMG,
    name: "Daniel T.",
    aboutHref: "/games/ticket-to-ride-europe",
    aboutText: "Ticket to Ride: Europe",
    title: "🔥 Fast, furious, and fiercely fun!",
    body: "This racing game is all about managing risk and momentum — it captures the tension of high-speed races with surprising elegance. Every decision matters, and the modular board keeps it fresh. A must-play for fans of dynamic gameplay.",
    images: [REVIEW_1_IMG1, REVIEW_1_IMG2],
  },
  {
    rating: 5,
    date: "March 18, 2025",
    avatarSrc: PERSON2_IMG,
    name: "Antony S.",
    aboutHref: "/games/catan",
    aboutText: "Catan",
    title: "Exquisite !",
    body: "Awesome product. Prepare yourself. This one does really big hugs to your gaming table. 36 X 60 Inches. Awesome luxurious and sober table presence and fully reversible. A nice transport bag is already included in the package.",
    images: [REVIEW_2_IMG1, REVIEW_2_IMG2],
  },
];

export default function ReviewsComments({ children }) {
  return (
    <section className="grid grid-cols-2 gap-10 w-full max-w-6xl mx-auto">
      {/* Sort option and Comments section */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <label className="uppercase text-lg font-semibold" for="reviews-comments">
            sort by
          </label>
          <select id="reviews-comments">
            <option value="most-recent">Most Recent</option>
            <option value="oldest">Oldest</option>
            <option value="highest-rated">Highest Rated</option>
            <option value="lowest-rated">Lowest Rated</option>
          </select>
        </div>

        <div className="flex flex-col gap-6">
          {reviewComments.map((review, idx) => (
            <ReviewCard
              className="border-t-2 border-[color:var(--color-light-purple)]"
              key={idx}
              {...review}
              collapsible={true}
            />
          ))}
        </div>
      </div>

      {/* Stay updated section */}
      <SubscribeSection className="px-14 py-28" />
    </section>
  );
}
