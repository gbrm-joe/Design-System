// The Website system — the public marketing front end for the apps. Same
// family, different posture: white ground, alternating grey bands, one
// permitted dark-fill CTA.
import {
  WEB_CONTAINER,
  WEB_NAV,
  WEB_NAV_LINK,
  WEB_SECTION_ALT,
  WEB_DISPLAY,
  WEB_SECTION_TITLE,
  WEB_EYEBROW,
  WEB_BODY,
  WEB_SMALL,
  WEB_BTN_CTA,
  WEB_BTN,
  WEB_CARD,
  WEB_FOOTER,
} from "../../../src/design";
import { Spec, Section, CoreRule } from "../ui";

export default function WebsiteSystem() {
  return (
    <>
      <CoreRule>
        <span className="font-semibold">The core rule, translated to marketing:</span> the page is for reading, not
        editing, so the ground is white — the inverse of the app's grey chrome. Grey bands alternate sections for
        rhythm. ONE deliberate inversion: a single dark-fill CTA is allowed, because a marketing page has one job. Dark
        fills remain banned in the apps.
      </CoreRule>

      <Section
        title="Type"
        note="Four sizes: display (5xl), section title (3xl), body (base), small (sm). Nothing between. The eyebrow is the small uppercase kicker above a headline."
      >
        <Spec name="WEB_DISPLAY">
          <div className={WEB_DISPLAY}>Property, managed properly.</div>
        </Spec>
        <Spec name="WEB_EYEBROW + WEB_SECTION_TITLE">
          <div>
            <div className={WEB_EYEBROW}>The platform</div>
            <div className={WEB_SECTION_TITLE}>One system, seven apps</div>
          </div>
        </Spec>
        <Spec name="WEB_BODY">
          <p className={`${WEB_BODY} max-w-md`}>
            Every record, lease and valuation in one place — with reports that come straight off your live data, not a
            spreadsheet export.
          </p>
        </Spec>
        <Spec name="WEB_SMALL">
          <span className={WEB_SMALL}>No card required · cancel any time</span>
        </Spec>
      </Section>

      <Section
        title="Buttons"
        note="WEB_BTN_CTA is the website's ONE permitted dark fill — one per page view. Every other action is WEB_BTN: white, bordered, the app's language. Never two dark buttons side by side."
      >
        <Spec name="WEB_BTN_CTA">
          <button className={WEB_BTN_CTA}>Book a demo</button>
        </Spec>
        <Spec name="WEB_BTN">
          <button className={WEB_BTN}>See pricing</button>
        </Spec>
        <Spec name="The pair — one dark, one bordered">
          <div className="flex gap-3">
            <button className={WEB_BTN_CTA}>Book a demo</button>
            <button className={WEB_BTN}>See pricing</button>
          </div>
        </Spec>
      </Section>

      <Section
        title="Structure"
        note="One container measure (max-w-5xl), one section rhythm (py-20). White sticky header with a hairline; sections alternate white / neutral-50 (the grey band carries border-y); dark footer mirrors the app's darkest surface."
      >
        <Spec name="WEB_NAV + WEB_NAV_LINK (h-16 inner row)">
          <div className={`${WEB_NAV} static w-[28rem] rounded border border-neutral-200`}>
            <div className="flex h-16 items-center justify-between px-6">
              <span className="text-sm font-semibold text-neutral-900">GBRM</span>
              <div className="flex items-center gap-5">
                <a className={WEB_NAV_LINK}>Apps</a>
                <a className={WEB_NAV_LINK}>Pricing</a>
                <a className={WEB_NAV_LINK}>Contact</a>
                <button className={`${WEB_BTN_CTA} !h-8 !px-3`}>Book a demo</button>
              </div>
            </div>
          </div>
        </Spec>
        <Spec name="WEB_CARD (the app's card, roomier)">
          <div className={`${WEB_CARD} w-64`}>
            <div className="text-sm font-semibold text-neutral-900">Property Manager</div>
            <p className={`${WEB_SMALL} mt-1`}>Leases, reviews and valuations across the whole portfolio.</p>
          </div>
        </Spec>
        <Spec name="WEB_FOOTER">
          <div className={`${WEB_FOOTER} w-[28rem] rounded px-6 !py-6`}>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white">GBRM</span>
              <span>© 2026 GBRM Ltd</span>
            </div>
          </div>
        </Spec>
      </Section>

      <Section
        title="Page anatomy"
        note="A landing page at reduced scale: sticky nav, white hero with the CTA pair, grey band of cards, dark footer. Sections alternate white / grey; the one dark fill is the CTA."
      >
        <Spec name="Nav → hero (white) → alt band (neutral-50) → footer (dark)">
          <div className="w-[30rem] overflow-hidden rounded-lg border border-neutral-300 bg-white">
            <div className="flex h-9 items-center justify-between border-b border-neutral-200 px-4">
              <span className="text-xs font-semibold">GBRM</span>
              <div className="flex items-center gap-3">
                <span className={`${WEB_NAV_LINK} !text-xs`}>Apps</span>
                <span className={`${WEB_NAV_LINK} !text-xs`}>Pricing</span>
                <span className={`${WEB_BTN_CTA} !h-6 !px-2 !text-xs`}>Book a demo</span>
              </div>
            </div>
            <div className={`${WEB_CONTAINER} py-10 text-center`}>
              <div className={WEB_EYEBROW}>Manager apps</div>
              <div className={`${WEB_SECTION_TITLE} mt-1`}>Property, managed properly.</div>
              <p className={`${WEB_SMALL} mx-auto mt-2 max-w-xs`}>
                Every record, lease and valuation in one place.
              </p>
              <div className="mt-4 flex justify-center gap-2">
                <span className={`${WEB_BTN_CTA} !h-8 !px-3 !text-xs`}>Book a demo</span>
                <span className={`${WEB_BTN} !h-8 !px-3 !text-xs`}>See pricing</span>
              </div>
            </div>
            <div className={`${WEB_SECTION_ALT} !py-6`}>
              <div className="flex justify-center gap-2 px-6">
                {["Property", "Survey", "Project"].map((name) => (
                  <div key={name} className={`${WEB_CARD} flex-1 !p-3`}>
                    <div className="text-xs font-semibold text-neutral-900">{name}</div>
                    <div className="mt-1 text-[10px] text-neutral-500">Manager</div>
                  </div>
                ))}
              </div>
            </div>
            <div className={`${WEB_FOOTER} !py-4 px-6 text-xs`}>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">GBRM</span>
                <span>© 2026 GBRM Ltd</span>
              </div>
            </div>
          </div>
        </Spec>
      </Section>
    </>
  );
}
