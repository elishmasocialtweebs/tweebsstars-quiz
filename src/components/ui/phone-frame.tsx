import React from 'react';

// An iPhone drawn in CSS: titanium body, side buttons, black bezel, the screen with the island, and the home
// bar if asked. Size it from outside with a box that has the phone's aspect ratio (aspect-[0.488]) and a
// height or width; the phone fills that box. Children are the screen's content.
interface Props {
  children: React.ReactNode;
  screenClassName?: string;   // background, padding and text alignment of the screen
  homeBar?: boolean;
}

export default function PhoneFrame({ children, screenClassName = 'bg-black', homeBar = false }: Props) {
  return (
    <>
      <div className="absolute inset-0 rounded-[13.5%/6.6%] bg-[#2b2b2d] shadow-[0_30px_80px_rgba(0,0,0,0.7),inset_0_0_0_1.5px_#55555a,inset_0_0_0_4px_#141416]">
        {/* Buttons: mute, volume up, volume down on the left; power on the right */}
        <span className="absolute -left-[3px] top-[17%] h-[3.5%] w-[3px] rounded-l-sm bg-[#4a4a4e]" />
        <span className="absolute -left-[3px] top-[24%] h-[7%] w-[3px] rounded-l-sm bg-[#4a4a4e]" />
        <span className="absolute -left-[3px] top-[33%] h-[7%] w-[3px] rounded-l-sm bg-[#4a4a4e]" />
        <span className="absolute -right-[3px] top-[27%] h-[10%] w-[3px] rounded-r-sm bg-[#4a4a4e]" />
      </div>
      <div className={`absolute inset-[3.2%_3.2%] overflow-hidden rounded-[11.5%/5.6%] ${screenClassName}`}>
        {children}
        <span className="absolute left-1/2 top-[2.2%] h-[3.6%] w-[31%] -translate-x-1/2 rounded-full bg-black" />
        {homeBar && <span className="absolute bottom-[1.4%] left-1/2 h-[5px] w-[36%] -translate-x-1/2 rounded-full bg-white/85" />}
      </div>
    </>
  );
}
