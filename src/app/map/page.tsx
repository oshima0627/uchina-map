import { MapView } from "./map-view";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "マップで探す",
  description:
    "沖縄の子連れOKスポットを地図上で確認。現在地の近くにある公園・水族館・屋内遊び場を、授乳室やベビーカー可などの設備つきで探せます。",
  path: "/map/",
});

export default function MapPage() {
  return (
    <div className="h-[calc(100dvh-9rem)] md:h-[calc(100dvh-3.5rem)] min-h-[60vh] relative bg-sand-light">
      <MapView />
    </div>
  );
}
