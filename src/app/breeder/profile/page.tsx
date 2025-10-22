"use client";

import { useEffect, useState } from "react";
import { getBreederProfile, BreederProfileDto } from "@/lib/auth";

export default function BreederProfilePage() {
  const [profile, setProfile] = useState<BreederProfileDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getBreederProfile();
        setProfile(data);
        console.log("브리더 프로필 데이터:", data);
      } catch (err) {
        console.error("프로필 조회 실패:", err);
        setError(err instanceof Error ? err.message : "프로필 조회 실패");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>브리더 프로필</h1>
        <p>로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>브리더 프로필</h1>
        <p style={{ color: "red" }}>에러: {error}</p>
        <p>로그인이 필요하거나 브리더 계정이 아닙니다.</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>브리더 프로필</h1>
        <p>프로필 데이터를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>브리더 프로필</h1>

      {/* 기본 정보 */}
      <section style={{ marginBottom: "30px", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
        <h2>기본 정보</h2>
        <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
          {profile.profileImageUrl && (
            <img
              src={profile.profileImageUrl}
              alt="프로필 이미지"
              style={{ width: "150px", height: "150px", objectFit: "cover", borderRadius: "8px" }}
            />
          )}
          <div>
            <p><strong>브리더 ID:</strong> {profile.breederId}</p>
            <p><strong>이름:</strong> {profile.name}</p>
            <p><strong>이메일:</strong> {profile.email}</p>
            <p><strong>전화번호:</strong> {profile.phoneNumber}</p>
            <p><strong>반려동물 종류:</strong> {profile.petType === "cat" ? "고양이" : "강아지"}</p>
            <p><strong>취급 품종:</strong> {profile.breeds.join(", ")}</p>
          </div>
        </div>
      </section>

      {/* 인증 정보 */}
      <section style={{ marginBottom: "30px", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
        <h2>인증 정보</h2>
        <p><strong>인증 상태:</strong> {profile.verificationStatus}</p>
        <p><strong>레벨:</strong> {profile.verificationLevel}</p>
        <p><strong>플랜:</strong> {profile.verificationPlan}</p>

        {profile.verificationDocuments && profile.verificationDocuments.length > 0 && (
          <div style={{ marginTop: "15px" }}>
            <h3>제출된 서류:</h3>
            <ul>
              {profile.verificationDocuments.map((doc, idx) => (
                <li key={idx}>
                  <strong>{doc.type}:</strong>{" "}
                  <a href={doc.url} target="_blank" rel="noopener noreferrer">
                    문서 보기
                  </a>
                  {" "}(업로드: {new Date(doc.uploadedAt).toLocaleString("ko-KR")})
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* 프로필 상세 */}
      <section style={{ marginBottom: "30px", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
        <h2>프로필 상세</h2>
        <p><strong>소개:</strong> {profile.profile.description || "(소개 없음)"}</p>
        <p><strong>위치:</strong> {profile.profile.location.city} {profile.profile.location.district}</p>
        <p><strong>전문 분야:</strong> {profile.profile.specialization.join(", ")}</p>

        {profile.profile.representativePhotos && profile.profile.representativePhotos.length > 0 && (
          <div style={{ marginTop: "15px" }}>
            <h3>대표 사진:</h3>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {profile.profile.representativePhotos.map((photoUrl, idx) => (
                <img
                  key={idx}
                  src={photoUrl}
                  alt={`대표 사진 ${idx + 1}`}
                  style={{ width: "200px", height: "200px", objectFit: "cover", borderRadius: "8px" }}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 통계 정보 */}
      <section style={{ marginBottom: "30px", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
        <h2>통계 정보</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "15px" }}>
          <div>
            <p><strong>받은 신청:</strong> {profile.stats.totalApplications}건</p>
            <p><strong>즐겨찾기:</strong> {profile.stats.totalFavorites}개</p>
          </div>
          <div>
            <p><strong>완료된 입양:</strong> {profile.stats.completedAdoptions}건</p>
            <p><strong>프로필 조회수:</strong> {profile.stats.profileViews}회</p>
          </div>
          <div>
            <p><strong>평균 평점:</strong> {profile.stats.averageRating.toFixed(1)}점</p>
            <p><strong>후기 개수:</strong> {profile.stats.totalReviews}개</p>
          </div>
        </div>
        <p style={{ marginTop: "10px" }}>
          <strong>가격 범위:</strong> {profile.stats.priceRange.min.toLocaleString()}원 ~ {profile.stats.priceRange.max.toLocaleString()}원
        </p>
      </section>

      {/* 기타 정보 */}
      <section style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
        <h2>기타 정보</h2>
        <p><strong>가입일:</strong> {new Date(profile.createdAt).toLocaleDateString("ko-KR")}</p>
        <p><strong>최종 수정일:</strong> {new Date(profile.updatedAt).toLocaleDateString("ko-KR")}</p>
      </section>

      {/* 디버그 정보 (개발용) */}
      <details style={{ marginTop: "30px", padding: "20px", background: "#f5f5f5", borderRadius: "8px" }}>
        <summary style={{ cursor: "pointer", fontWeight: "bold" }}>전체 데이터 보기 (개발용)</summary>
        <pre style={{ marginTop: "10px", padding: "10px", background: "white", borderRadius: "4px", overflow: "auto" }}>
          {JSON.stringify(profile, null, 2)}
        </pre>
      </details>
    </div>
  );
}
