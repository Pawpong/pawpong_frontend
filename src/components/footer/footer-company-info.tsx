import { COMPANY_INFO } from '@/constants/footer';

function Divider() {
  return <div className="w-px h-3 bg-grayscale-gray2" />;
}

export default function FooterCompanyInfo() {
  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:flex items-center gap-7 mb-4">
        <span className="text-xs font-semibold text-grayscale-gray6">포렌즈</span>
        <Divider />
        <div className="flex items-center gap-7">
          {COMPANY_INFO.map((info, index) => (
            <div key={info.label} className="contents">
              <Info label={info.label} value={info.value} />
              {index < COMPANY_INFO.length - 1 && <Divider />}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile */}
      <div className="lg:hidden flex flex-col gap-4 mb-4">
        <span className="text-[11px] md:text-xs font-semibold text-grayscale-gray6">포렌즈</span>
        {COMPANY_INFO.map((info) => (
          <InfoColumn key={info.label} label={info.label} value={info.value} />
        ))}
      </div>
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-6">
      <span className="text-xs font-semibold text-grayscale-gray5">{label}</span>
      <span className="text-xs font-semibold text-grayscale-gray5">{value}</span>
    </div>
  );
}

function InfoColumn({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-6">
      <span className="text-[11px] md:text-xs font-semibold text-grayscale-gray5 w-[86px] md:w-[94px]">{label}</span>
      <span className="text-[11px] md:text-xs font-semibold text-grayscale-gray5">{value}</span>
    </div>
  );
}
