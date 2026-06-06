import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { CameraView } from '@/features/camera/components/CameraView';

export default function CameraScreen() {
  return (
    <ScreenContainer padded={false} edges={[]}>
      <CameraView />
    </ScreenContainer>
  );
}
