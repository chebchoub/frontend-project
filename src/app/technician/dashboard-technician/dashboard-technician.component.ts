import { Component } from '@angular/core';
import { ImageCompressService, ResizeOptions, ImageUtilityService, IImage, SourceImage } from 'ng2-image-compress';
import { ServiceTechnicianService } from '../service/service-technician.service';

@Component({
  selector: 'app-dashboard-technician',
  templateUrl: './dashboard-technician.component.html',
  styleUrl: './dashboard-technician.component.css'
})
export class DashboardTechnicianComponent {
  title = 'app';
  selectedImage: any;
  processedImages: any = [];
  showTitle: boolean = false;
  profilePhotoURL: string = "";
  constructor(private imgCompressService: ImageCompressService, private technicienService: ServiceTechnicianService) {

  }
  onChange(fileInput: any) {
    let fileList: FileList;

    let images: Array<IImage> = [];

    // Convertir fileInput.target.files en FileList
    fileList = fileInput.target.files;

    // Vérifier si fileList est défini et non null
    if (fileList) {
      // Convertir FileList en un tableau de fichiers
      let files: File[] = Array.from(fileList);

      ImageCompressService.filesArrayToCompressedImageSource(files).then(observableImages => {
        observableImages.subscribe((image) => {
          images.push(image);
          this.profilePhotoURL = image.compressedImage.imageDataUrl;
          const technicianRequest: any = {
            email: "chabchoub069@gmail.com",
            firstName: "chabchoub",
            lastName: "ali",
            profilePhoto: this.profilePhotoURL,
          }
          this.technicienService.updateUpdateTechnicien(technicianRequest, "663ca1d04f53b62cfb9923f4").subscribe(
            (response: any) => {
            }
          );

        }, (error) => {
          console.log("Error while converting");
        }, () => {
          this.processedImages = images;
          this.showTitle = true;
        });
      });
    }
  }


}
