import "./team.css";
import WorkIcon from "@mui/icons-material/Work";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import EmailIcon from "@mui/icons-material/Email";
import CodeIcon from "@mui/icons-material/Code";

const Team = () => {
  return (
    <div className="team-container">
      <h1 className="team-header">Research Team</h1>
      <p className="team-subtitle">
        Meet the investigators behind the Musculoskeletal 3D Epigenome Atlas
      </p>

      <div className="team-grid">
        <div className="team-card">
          <div className="team-member-header">
            <div className="member-avatar">
              <span className="avatar-initials">YH</span>
            </div>
            <div className="member-info">
              <h2 className="member-name">Yi-Hsiang Hsu</h2>
              <p className="member-credentials">MD, ScD</p>
            </div>
          </div>

          <div className="member-details">
            <div className="detail-item">
              <WorkIcon className="detail-icon" />
              <span className="detail-text">
                Associate Scientist / Assistant Professor
              </span>
            </div>

            <div className="detail-item">
              <AccountBalanceIcon className="detail-icon" />
              <span className="detail-text">
                Hinda and Arthur Marcus Institute for Aging Research
                <br />
                Hebrew Senior Life, Boston, MA
              </span>
            </div>
            <div className="detail-item">
              <AccountBalanceIcon className="detail-icon" />
              <span className="detail-text">
                Department of Medicine
                <br />
                Beth Israel Deaconess Medical Center
              </span>
            </div>

            <div className="detail-item">
              <EmailIcon className="detail-icon" />
              <a
                href="mailto:yihsianghsu@hsl.harvard.edu"
                className="email-link"
              >
                YiHsiangHsu@hsl.harvard.edu
              </a>
            </div>
          </div>

          <div className="member-bio">
            <p>
              Dr. Hsu’s research focuses on (1) genetic contribution of common
              aging relevant disorders using population-based next generation
              whole genome sequencing, exome-sequencing and GWAS approaches; (2)
              statistical method development on multiple-phenotype association
              analyses; and (3) identifying biomarkers of osteoporosis using
              metabolomics.
            </p>
          </div>
        </div>

        <div className="team-card">
          <div className="team-member-header">
            <div className="member-avatar">
              <span className="avatar-initials">MT</span>
            </div>
            <div className="member-info">
              <h2 className="member-name">Ming-Ju Tsai</h2>
              <p className="member-credentials">PhD</p>
            </div>
          </div>

          <div className="member-details">
            <div className="detail-item">
              <WorkIcon className="detail-icon" />
              <span className="detail-text">Postdoctoral Research Fellow</span>
            </div>

            <div className="detail-item">
              <AccountBalanceIcon className="detail-icon" />
              <span className="detail-text">
                Hinda and Arthur Marcus Institute for Aging Research
                <br />
                Hebrew Senior Life, Boston, MA
              </span>
            </div>

            <div className="detail-item">
              <AccountBalanceIcon className="detail-icon" />
              <span className="detail-text">
                Department of Medicine
                <br />
                Beth Israel Deaconess Medical Center
              </span>
            </div>

            <div className="detail-item">
              <EmailIcon className="detail-icon" />
              <a
                href="mailto:mingjutsai@hsl.harvard.edu"
                className="email-link"
              >
                mingjutsai@hsl.harvard.edu
              </a>
            </div>
          </div>

          <div className="member-bio">
            <p>
              Dr. Tsai is a computational genomics scientist with extensive
              experience developing novel methods to integrate multi-omics and
              human genetics data. His research focuses on post-GWAS functional
              genomics, variant-to-function mapping, and machine-learning
              frameworks for causal inference.
            </p>
          </div>
        </div>
        <div className="team-card">
          <div className="team-member-header">
            <div className="member-avatar">
              <span className="avatar-initials">TF</span>
            </div>
            <div className="member-info">
              <h2 className="member-name">Tzu-Yun Fan</h2>
              <p className="member-credentials">Software Engineer Intern</p>
            </div>
          </div>

          <div className="member-details">
            <div className="detail-item">
              <CodeIcon className="detail-icon" />
              <span className="detail-text">Platform Developer</span>
            </div>

            <div className="detail-item">
              <AccountBalanceIcon className="detail-icon" />
              <span className="detail-text">
                Hinda and Arthur Marcus Institute for Aging Research
                <br />
                Hebrew Senior Life, Boston, MA
              </span>
            </div>

            <div className="detail-item">
              <AccountBalanceIcon className="detail-icon" />
              <span className="detail-text">
                Department of Medicine
                <br />
                Beth Israel Deaconess Medical Center and Harvard Medical School
              </span>
            </div>

            {/* Uncomment if you want to add email */}
            {/* <div className="detail-item">
            <EmailIcon className="detail-icon" />
            <a href="mailto:your-email@example.com" className="email-link">
                your-email@example.com
            </a>
        </div> */}
          </div>

          <div className="member-bio">
            <p>
              Tzu-Yun designed and developed the Musculoskeletal 3D Epigenome
              Atlas platform, creating a full-stack web application that enables
              researchers to explore and visualize genomic regulatory data
              across musculoskeletal cell types.
            </p>
          </div>
        </div>
      </div>

      {/* Optional: Add section for acknowledgments */}
      <div className="acknowledgments-section">
        <h2 className="section-header">Acknowledgments</h2>
        <div className="acknowledgments-content">
          <p>
            This project integrates data from the ENCODE and Roadmap Epigenomics
            consortia. We thank all contributors to these public resources.
          </p>
        </div>
      </div>

      {/* Optional: Collaboration section */}
      <div className="collaboration-section">
        <h2 className="section-header">Collaborations & Funding</h2>
        <div className="collaboration-content">
          <p>
            For collaboration inquiries or questions about the atlas, please
            reach out via email.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Team;
