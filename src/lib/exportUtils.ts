import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

export interface ExportableReview {
  id: string;
  bookId: string;
  review: string;
  emotions: string[];
  topics: string[];
  moodSummary: string;
  createdAt: Date;
  bookTitle?: string;
  bookAuthor?: string;
}

/**
 * HTML 요소를 PNG 이미지로 다운로드
 */
export const exportToPNG = async (
  element: HTMLElement, 
  filename: string,
  options?: {
    scale?: number;
    backgroundColor?: string;
  }
): Promise<void> => {
  try {
    const canvas = await html2canvas(element, {
      scale: options?.scale || 2,
      backgroundColor: options?.backgroundColor || '#ffffff',
      useCORS: true,
      allowTaint: true,
      logging: false,
      width: element.offsetWidth,
      height: element.offsetHeight,
    });

    canvas.toBlob((blob) => {
      if (blob) {
        saveAs(blob, `${filename}.png`);
      }
    }, 'image/png');
  } catch (error) {
    console.error('PNG 내보내기 실패:', error);
    throw new Error('이미지 저장에 실패했습니다.');
  }
};

/**
 * 리뷰 데이터를 마크다운 형식으로 변환
 */
export const exportToMarkdown = (review: ExportableReview): void => {
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const markdown = `# 📚 독서 감상문

## 책 정보
- **제목**: ${review.bookTitle || '제목 정보 없음'}
- **저자**: ${review.bookAuthor || '저자 정보 없음'}
- **작성일**: ${formatDate(review.createdAt)}

## 한줄 요약
${review.moodSummary}

## 상세 감상
${review.review}

## 느낀 감정
${review.emotions.map(emotion => `- ${emotion}`).join('\n')}

## 주요 주제
${review.topics.map(topic => `- ${topic}`).join('\n')}

---
*BookMood에서 작성한 감상문입니다.*
`;

  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
  const filename = `${review.bookTitle || 'BookMood'}_감상문_${formatDate(review.createdAt)}.md`;
  saveAs(blob, filename);
};

/**
 * 리뷰 카드의 HTML 요소를 생성 (PNG 내보내기용)
 */
export const createExportableCard = (review: ExportableReview): HTMLElement => {
  const card = document.createElement('div');
  card.style.cssText = `
    width: 400px;
    background: white;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;

  card.innerHTML = `
    <div style="margin-bottom: 16px;">
      <div style="display: flex; align-items: center; margin-bottom: 8px;">
        <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #A8B5E8, #B5D4C8); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
          <span style="color: white; font-size: 16px;">📚</span>
        </div>
        <div>
          <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #1f2937;">${review.bookTitle || '제목 정보 없음'}</h3>
          <p style="margin: 0; font-size: 12px; color: #6b7280;">${review.bookAuthor || '저자 정보 없음'}</p>
        </div>
      </div>
      <p style="margin: 0; font-size: 11px; color: #9ca3af; display: flex; align-items: center;">
        📅 ${review.createdAt.toLocaleDateString('ko-KR')}
      </p>
    </div>

    <div style="margin-bottom: 16px;">
      <h4 style="margin: 0 0 8px 0; font-size: 13px; font-weight: 600; color: #374151;">한줄 요약</h4>
      <p style="margin: 0; font-size: 14px; color: #4b5563; line-height: 1.5;">${review.moodSummary}</p>
    </div>

    <div style="margin-bottom: 16px;">
      <h4 style="margin: 0 0 8px 0; font-size: 13px; font-weight: 600; color: #374151;">상세 감상</h4>
      <p style="margin: 0; font-size: 13px; color: #4b5563; line-height: 1.5; max-height: 120px; overflow: hidden;">${review.review}</p>
    </div>

    <div style="margin-bottom: 16px;">
      <h4 style="margin: 0 0 8px 0; font-size: 13px; font-weight: 600; color: #374151;">감정</h4>
      <div style="display: flex; flex-wrap: wrap; gap: 6px;">
        ${review.emotions.map(emotion => 
          `<span style="background: linear-gradient(135deg, #A8B5E8, #B5D4C8); color: white; padding: 4px 8px; border-radius: 12px; font-size: 11px;">${emotion}</span>`
        ).join('')}
      </div>
    </div>

    <div style="margin-bottom: 16px;">
      <h4 style="margin: 0 0 8px 0; font-size: 13px; font-weight: 600; color: #374151;">주제</h4>
      <div style="display: flex; flex-wrap: wrap; gap: 6px;">
        ${review.topics.map(topic => 
          `<span style="background: #f3f4f6; color: #374151; padding: 4px 8px; border-radius: 12px; font-size: 11px; border: 1px solid #e5e7eb;">${topic}</span>`
        ).join('')}
      </div>
    </div>

    <div style="text-align: center; padding-top: 16px; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0; font-size: 10px; color: #9ca3af;">BookMood에서 작성한 감상문</p>
    </div>
  `;

  return card;
};
