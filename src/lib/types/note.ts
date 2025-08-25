/**
 * KuzuDB의 Note 스키마에 대응하는 프론트엔드 타입입니다.
 * Rust의 Note 구조체와 필드가 동기화되어야 합니다.
 */
export interface Note {
	uuid: string;
	title: string;
	content: string;
	created_at: string; // ISO 8601 형식의 문자열
	updated_at: string; // ISO 8601 형식의 문자열
	rank: string;
	parent_uuid: string | null;
	file_path: string;
}
