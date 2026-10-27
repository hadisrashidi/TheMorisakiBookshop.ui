export class LegalSectionModel {
  heading = '';
  text = '';
}

export class LegalPageModel {
  title = '';
  description = '';
  sections: LegalSectionModel[] = [];
}
