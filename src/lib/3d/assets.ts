import { Vehicle } from '../../types';
import { ExtendedVehicle } from '../../data/vehicles';
import { CameraTargetId, ModificationCategoryNavId } from './camera';

export interface Vehicle3DAsset {
  id: string;
  vehicleId: string;
  model: string;
  variant: string;
  isExactModel: boolean; // Subtle indicator if procedural/preview model
  assetNoticeText: string;
  bodyStyle: 'coupe' | 'sedan' | 'suv' | 'hypercar';
  baseColor: string;
  chassisCode: string;
  chassisDimensions: {
    length: number;
    width: number;
    height: number;
    wheelbase: number;
    rideHeightOffset: number;
  };
  supportedCameraTargets: CameraTargetId[];
  supportedModificationCategories: ModificationCategoryNavId[];
  availableAeroWings: ('stock' | 'ducktail' | 'gt_wing' | 'drag')[];
  defaultAeroWing: 'stock' | 'ducktail' | 'gt_wing' | 'drag';
}

/**
 * Resolves a Vehicle data object into a 3D Asset configuration.
 * Allows replacing individual vehicle 3D assets in future phases without rewriting the Garage.
 */
export function resolveVehicle3DAsset(vehicle?: Vehicle | ExtendedVehicle | null): Vehicle3DAsset {
  if (!vehicle) {
    return {
      id: 'asset-default-gt',
      vehicleId: 'default',
      model: '911 GT3 RS',
      variant: 'Weissach Package',
      isExactModel: false,
      assetNoticeText: 'Interactive 3D preview asset',
      bodyStyle: 'coupe',
      baseColor: '#C0C0C0',
      chassisCode: '992.1',
      chassisDimensions: {
        length: 4.57,
        width: 1.90,
        height: 1.32,
        wheelbase: 2.45,
        rideHeightOffset: 0.05
      },
      supportedCameraTargets: ['hero', 'front', 'rear', 'side', 'top', 'wheel', 'brake', 'exhaust', 'engine', 'interior', 'suspension'],
      supportedModificationCategories: ['exterior', 'wheels', 'brakes', 'suspension', 'performance', 'interior'],
      availableAeroWings: ['stock', 'ducktail', 'gt_wing', 'drag'],
      defaultAeroWing: 'gt_wing'
    };
  }

  const vId = vehicle.id.toLowerCase();
  const vModel = vehicle.model?.toLowerCase() || '';
  const isPorsche = vId.includes('porsche') || vehicle.make?.toLowerCase() === 'porsche';
  const isBmw = vId.includes('bmw') || vehicle.make?.toLowerCase() === 'bmw';
  const isAudi = vId.includes('audi') || vehicle.make?.toLowerCase() === 'audi';
  const isSuv = vId.includes('suv') || vId.includes('cayenne') || vId.includes('macan') || vId.includes('x5') || vId.includes('rs-q8');

  let bodyStyle: 'coupe' | 'sedan' | 'suv' | 'hypercar' = 'coupe';
  let defaultAeroWing: 'stock' | 'ducktail' | 'gt_wing' | 'drag' = 'gt_wing';

  if (isSuv) {
    bodyStyle = 'suv';
    defaultAeroWing = 'stock';
  } else if (vModel.includes('m3') || vModel.includes('m5') || vModel.includes('rs6') || vModel.includes('taycan') || vModel.includes('panamera')) {
    bodyStyle = 'sedan';
    defaultAeroWing = 'ducktail';
  } else if (vModel.includes('gt3') || vModel.includes('gt4') || vModel.includes('gt') || vModel.includes('r8')) {
    bodyStyle = 'coupe';
    defaultAeroWing = 'gt_wing';
  }

  return {
    id: `asset-${vehicle.id}`,
    vehicleId: vehicle.id,
    model: vehicle.model,
    variant: vehicle.trim || (vehicle as ExtendedVehicle).variant || 'Standard Spec',
    isExactModel: false, // Honest specification: procedural DriveForge 3D preview asset
    assetNoticeText: 'DriveForge Studio • Interactive 3D preview asset',
    bodyStyle,
    baseColor: vehicle.colorHex || '#C0C0C0',
    chassisCode: vehicle.chassisCode || 'OEM',
    chassisDimensions: {
      length: bodyStyle === 'suv' ? 4.85 : bodyStyle === 'sedan' ? 4.75 : 4.55,
      width: bodyStyle === 'suv' ? 1.98 : 1.92,
      height: bodyStyle === 'suv' ? 1.65 : bodyStyle === 'sedan' ? 1.42 : 1.30,
      wheelbase: bodyStyle === 'suv' ? 2.85 : 2.75,
      rideHeightOffset: bodyStyle === 'suv' ? 0.12 : 0.05
    },
    supportedCameraTargets: ['hero', 'front', 'rear', 'side', 'top', 'wheel', 'brake', 'exhaust', 'engine', 'interior', 'suspension'],
    supportedModificationCategories: ['exterior', 'wheels', 'brakes', 'suspension', 'performance', 'interior'],
    availableAeroWings: ['stock', 'ducktail', 'gt_wing', 'drag'],
    defaultAeroWing
  };
}
