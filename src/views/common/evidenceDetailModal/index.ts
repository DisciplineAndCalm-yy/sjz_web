import evidenceDetailModal from './src/evidenceDetailModal.vue';

export interface EvidenceDetailModalProps {
  questionId: string;
  sendDepartId?: string;
  sendUserId?: string;
}

export interface EvidenceFile {
  createTime: string;
  id: string;
  storageId: string;
  storageName: string;
  storageSize: string;
  storageType: string;
  storageUrl: string;
  updateTime: string;
}
interface EvidenceRecord {
  departId: string;
  departName: string;
  filePath: string;
  attachments: EvidenceFile[];
}

export interface EvidenceResult {
  type: '1' | '0';
  file: EvidenceRecord[];
}

export default evidenceDetailModal;
